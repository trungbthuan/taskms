import { prisma } from "../config/prisma.js";

class TaskService {
    // Chức năng Giao việc
    async createTask(data) {
        const { title, description, categoryId, assigneeId, managerId, deadline, priority } = data;
        try {
            // Validate bắt buộc
            if (!title || !assigneeId || !managerId || !deadline) {
                throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
            }

            // Ép kiểu dữ liệu (Data Casting)
            // Lưu ý: Prisma rất nghiêm ngặt, assigneeId phải là số, deadline phải là Date
            const newTask = await prisma.task.create({
                data: {
                    title,
                    description: description || null,
                    categoryId: categoryId ? Number(categoryId) : null, // ← ép kiểu
                    assigneeId: Number(assigneeId),
                    managerId: Number(managerId),
                    deadline: new Date(deadline),
                    status: "Pending",
                    progressPercent: 0,
                },
            });
            return newTask;
        } catch (error) {
            // In ra console để bạn dễ theo dõi lỗi thật sự là gì
            console.error("Lỗi chi tiết tại Service:", error);
            throw error;
        }
    }

    // Chức năng Cập nhật tiến độ
    async updateTaskProgress(id, updateData) {
        const { progressPercent, issueNote } = updateData;
        let status = "In Progress";
        let completedDate = null;

        if (progressPercent === 100) {
            status = "Completed";
            completedDate = new Date();
        } else if (issueNote) {
            status = "Stuck";
        }

        return await prisma.task.update({
            where: { id: Number(id) },
            data: {
                ...updateData,
                status,
                completedDate,
            },
        });
    }

    //Kết thúc công việc & Đánh giá chất lượng
    async finishAndRateTask(id, evaluationData) {
        const { qualityRating, managerFeedback } = evaluationData;

        // 1. Kiểm tra công việc có tồn tại không
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
        });

        if (!task) throw new Error("Không tìm thấy công việc để đánh giá.");

        // 2. Kiểm tra xem việc đã hoàn thành chưa (progressPercent = 100)
        if (task.progressPercent < 100) {
            throw new Error("Công việc chưa hoàn thành 100%, sếp chưa thể đánh giá.");
        }

        // 3. Cập nhật đánh giá của sếp
        return await prisma.task.update({
            where: { id: Number(id) },
            data: {
                qualityRating: Number(qualityRating),
                managerFeedback: managerFeedback,
                status: "Completed", // Đảm bảo trạng thái cuối cùng
            },
        });
    }

    // Thống kê công việc của nhân viên
    async getEmployeeStats(assigneeId) {
        // 1. Lấy tất cả công việc của nhân viên đó
        const tasks = await prisma.task.findMany({
            where: {
                assigneeId: Number(assigneeId),
            },
            orderBy: {
                assignedDate: "desc", // Việc mới giao hiện lên đầu
            },
        });

        // 2. Tính toán thống kê nhanh
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === "Completed").length;
        const stuck = tasks.filter((t) => t.status === "Stuck").length;
        const pending = tasks.filter((t) => t.status === "Pending" || t.status === "In Progress").length;

        // 3. Tính điểm trung bình (chỉ tính những việc đã có điểm)
        const ratedTasks = tasks.filter((t) => t.qualityRating !== null);
        const averageRating = ratedTasks.length > 0 ? (ratedTasks.reduce((acc, curr) => acc + curr.qualityRating, 0) / ratedTasks.length).toFixed(1) : 0;

        return {
            summary: {
                total,
                completed,
                stuck,
                pending,
                averageRating: Number(averageRating),
            },
            tasks,
        };
    }
}

export default new TaskService();
