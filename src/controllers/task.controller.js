import taskService from "../services/task.service.js";
import { prisma } from "../config/prisma.js";

export const getHome = async (req, res) => {
    try {
        res.render("../views/home", {
            title: "Trang chủ",
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        //res.status(201).json({ message: "Giao việc thành công!", data: task });
        getTask(req, res); // ← sau khi tạo xong, trả về form giao việc mới để tiếp tục giao việc khác
    } catch (error) {
        // Trả về lỗi cụ thể từ Model hoặc Service
        res.status(400).json({
            message: "Dữ liệu không hợp lệ",
            error: error.message,
        });
    }
};

export const getTask = async (req, res) => {
    try {
        const [categories, employees, jobs] = await Promise.all([
            prisma.category.findMany({ orderBy: { name: "asc" } }),
            prisma.employee.findMany({
                where: { role: "Employee" },
                orderBy: { name: "asc" },
            }),
            prisma.job.findMany({
                include: {
                    category: { select: { id: true, name: true } },
                },
                orderBy: {
                    categoryId: "asc",
                },
            }),
            // Lấy jobs theo category cụ thể
            // prisma.job.findMany({
            //     where: { categoryId: 1 },
            // });
        ]);

        res.render("../views/task/task-new", {
            title: "Giao việc mới",
            user: req.user,
            categories, // ← truyền vào view
            employees, // ← thay thế option cứng
            jobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── HIỂN THỊ FORM CẬP NHẬT TIẾN ĐỘ ───────────────────
export const getUpdateProgress = async (req, res) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                assignee: { select: { id: true, name: true, department: true } },
                manager: { select: { id: true, name: true } },
                category: { select: { id: true, name: true } },
            },
        });

        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        // Chỉ cho phép assignee hoặc manager cập nhật
        const employeeId = req.user.employeeId;
        if (task.assigneeId !== employeeId && task.managerId !== employeeId) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật công việc này" });
        }

        res.render("../views/task/task-progress", {
            title: "Cập nhật tiến độ",
            user: req.user,
            task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── XỬ LÝ CẬP NHẬT TIẾN ĐỘ ───────────────────────────
export const updateProgress = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { progressPercent, status, note } = req.body;
        const progress = Number(progressPercent);

        // Tự động đặt status dựa trên % tiến độ
        let newStatus = status;
        if (progress === 100) {
            newStatus = "Completed";
        } else if (progress === 0) {
            newStatus = "Pending";
        } else if (!newStatus) {
            newStatus = "In Progress";
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                progressPercent: progress,
                status: newStatus,
                completedDate: progress === 100 ? new Date() : null,
            },
        });

        res.redirect(`/api/tasks/list`); // ← sau khi cập nhật xong, quay về danh sách công việc
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const evaluateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const evaluatedTask = await taskService.finishAndRateTask(id, req.body);
        res.json({
            message: "Sếp đã đánh giá công việc thành công!",
            data: evaluatedTask,
        });
    } catch (error) {
        res.status(400).json({ message: "Lỗi đánh giá", error: error.message });
    }
};

export const getEmployeeReport = async (req, res) => {
    const { assigneeId } = req.params;
    try {
        const stats = await taskService.getEmployeeStats(assigneeId);
        res.json({
            message: `Báo cáo công việc của nhân viên ${assigneeId}`,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thống kê", error: error.message });
    }
};

// Dành cho admin: Lấy danh sách tất cả công việc
export const getTaskList = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: {
                    select: { id: true, name: true, avatar: true, department: true },
                },
                manager: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { assignedDate: "desc" },
        });

        res.render("../views/task/task-list", {
            title: "Danh sách công việc",
            user: req.user,
            tasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getTaskDetail = async (req, res) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                assignee: { select: { id: true, name: true, department: true, avatar: true } },
                manager: { select: { id: true, name: true, department: true } },
                category: { select: { id: true, name: true } },
            },
        });

        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        res.render("../views/task/task-detail", {
            title: task.title,
            user: req.user,
            task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getDashboard = async (req, res) => {
    try {
        const [total, inProgress, completed, stuck, recentTasks] = await Promise.all([
            // Tổng công việc
            prisma.task.count(),

            // Đang xử lý
            prisma.task.count({ where: { status: "In Progress" } }),

            // Hoàn thành
            prisma.task.count({ where: { status: "Completed" } }),

            // Vướng mắc
            prisma.task.count({ where: { status: "Stuck" } }),

            // 5 công việc gần đây
            prisma.task.findMany({
                take: 5,
                orderBy: { assignedDate: "desc" },
                include: {
                    assignee: { select: { name: true, avatar: true } },
                    manager: { select: { name: true } },
                },
            }),
        ]);

        // Sắp hết hạn (deadline trong 3 ngày tới, chưa hoàn thành)
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
        const nearDeadline = await prisma.task.count({
            where: {
                status: { notIn: ["Completed"] },
                deadline: { lte: threeDaysLater },
            },
        });

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        res.render("../views/dashboard", {
            title: "Dashboard",
            user: req.user,
            stats: { total, inProgress, completed, stuck, nearDeadline, completionRate },
            recentTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await prisma.task.delete({
            where: { id: Number(req.params.id) },
        });

        res.status(200).json({ message: "Xóa thành công" }); // ← trả về 200 rõ ràng
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Xóa thất bại", error: error.message });
    }
};

// ─── HIỂN THỊ FORM SỬA ─────────────────────────────────
export const getTaskEdit = async (req, res) => {
    try {
        const [task, categories, employees, managers, jobs] = await Promise.all([
            prisma.task.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    assignee: { select: { id: true, name: true } },
                    manager: { select: { id: true, name: true } },
                    category: { select: { id: true, name: true } },
                },
            }),
            prisma.category.findMany({ orderBy: { name: "asc" } }),
            prisma.employee.findMany({ where: { role: "Employee" }, orderBy: { name: "asc" } }),
            prisma.employee.findMany({ where: { role: "Manager" }, orderBy: { name: "asc" } }),
            prisma.job.findMany({
                include: {
                    category: { select: { id: true, name: true } },
                },
                orderBy: {
                    categoryId: "asc",
                },
            }),
        ]);

        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        // Format deadline về YYYY-MM-DD cho input type="date"
        const deadlineFormatted = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : "";

        res.render("../views/task/task-edit", {
            title: "Chỉnh sửa công việc",
            user: req.user,
            task,
            categories,
            employees,
            managers,
            jobs,
            deadlineFormatted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── XỬ LÝ LƯU SỬA ────────────────────────────────────
export const updateTask = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, description, categoryId, assigneeId, managerId, deadline, status, progressPercent } = req.body;

        // Tự động cập nhật completedDate
        const isCompleted = status === "Completed";
        const completedDate = isCompleted ? new Date() : null;

        await prisma.task.update({
            where: { id },
            data: {
                title,
                description: description || null,
                categoryId: categoryId ? Number(categoryId) : null,
                assigneeId: Number(assigneeId),
                managerId: Number(managerId),
                deadline: new Date(deadline),
                status,
                progressPercent: Number(progressPercent) || 0,
                completedDate,
            },
        });

        res.redirect(`/api/tasks/${id}/detail`); // ← về trang chi tiết sau khi lưu
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getJobNew = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
        res.render("../views/task/job-new", {
            title: "Tạo công việc mới",
            user: req.user,
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const createJob = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        await prisma.job.create({
            data: {
                title,
                description: description || null,
                categoryId: Number(categoryId),
            },
        });
        res.redirect("/api/tasks/new-job"); // ← sau khi tạo xong, quay về form tạo công việc mới
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
