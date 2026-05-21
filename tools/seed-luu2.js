import { prisma } from "../src/config/prisma.js";

async function main() {
    // ── Tạo Employees ──────────────────────────────
    await prisma.employee.createMany({
        data: [
            {
                id: 1,
                name: "Nguyễn Văn Minh",
                email: "minh.nguyen@taskflow.vn",
                role: "Manager",
                department: "Công nghệ thông tin",
                avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+Minh&background=1B2A4A&color=fff",
            },
            {
                id: 2,
                name: "Trần Thị Hoa",
                email: "hoa.tran@taskflow.vn",
                role: "Manager",
                department: "Kinh doanh",
                avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Hoa&background=2563EB&color=fff",
            },
            {
                id: 3,
                name: "Lê Quốc Bảo",
                email: "bao.le@taskflow.vn",
                role: "Employee",
                department: "Công nghệ thông tin",
                avatar: "https://ui-avatars.com/api/?name=Le+Quoc+Bao&background=16A34A&color=fff",
            },
            {
                id: 4,
                name: "Phạm Thị Lan",
                email: "lan.pham@taskflow.vn",
                role: "Employee",
                department: "Công nghệ thông tin",
                avatar: "https://ui-avatars.com/api/?name=Pham+Thi+Lan&background=9333EA&color=fff",
            },
            {
                id: 5,
                name: "Hoàng Văn Tuấn",
                email: "tuan.hoang@taskflow.vn",
                role: "Employee",
                department: "Kinh doanh",
                avatar: "https://ui-avatars.com/api/?name=Hoang+Van+Tuan&background=EA580C&color=fff",
            },
            {
                id: 6,
                name: "Đỗ Thị Mai",
                email: "mai.do@taskflow.vn",
                role: "Employee",
                department: "Kinh doanh",
                avatar: "https://ui-avatars.com/api/?name=Do+Thi+Mai&background=0891B2&color=fff",
            },
        ],
        skipDuplicates: true,
    });

    // ── Tạo Tasks ───────────────────────────────────
    await prisma.task.createMany({
        data: [
            {
                title: "Thiết kế giao diện Dashboard",
                description: "Thiết kế UI/UX cho trang Dashboard quản lý công việc, bao gồm các biểu đồ thống kê và danh sách công việc gần đây.",
                assigneeId: 3,
                managerId: 1,
                deadline: new Date("2025-06-15T17:00:00"),
                status: "In Progress",
                progressPercent: 65,
                qualityRating: null,
            },
            {
                title: "Phát triển API Authentication",
                description: "Xây dựng API đăng ký, đăng nhập, JWT token và refresh token cho hệ thống.",
                assigneeId: 4,
                managerId: 1,
                deadline: new Date("2025-06-10T17:00:00"),
                status: "Completed",
                progressPercent: 100,
                completedDate: new Date("2025-06-08T16:30:00"),
                qualityRating: 5,
            },
            {
                title: "Báo cáo doanh thu tháng 5",
                description: "Tổng hợp và phân tích doanh thu tháng 5, so sánh với cùng kỳ năm ngoái và lập báo cáo trình ban giám đốc.",
                assigneeId: 5,
                managerId: 2,
                deadline: new Date("2025-06-05T17:00:00"),
                status: "Stuck",
                progressPercent: 40,
                qualityRating: null,
            },
            {
                title: "Tích hợp cổng thanh toán VNPay",
                description: "Tích hợp VNPay vào hệ thống, hỗ trợ thanh toán qua thẻ nội địa, quốc tế và ví điện tử.",
                assigneeId: 3,
                managerId: 1,
                deadline: new Date("2025-06-20T17:00:00"),
                status: "Pending",
                progressPercent: 0,
                qualityRating: null,
            },
            {
                title: "Chăm sóc khách hàng mới tháng 6",
                description: "Liên hệ và chăm sóc danh sách 50 khách hàng tiềm năng mới, ghi nhận phản hồi và cập nhật vào CRM.",
                assigneeId: 6,
                managerId: 2,
                deadline: new Date("2025-06-30T17:00:00"),
                status: "In Progress",
                progressPercent: 30,
                qualityRating: null,
            },
            {
                title: "Fix bug phân quyền người dùng",
                description: "Kiểm tra và sửa lỗi phân quyền: nhân viên có thể truy cập trang admin, cần xử lý middleware và route guard.",
                assigneeId: 4,
                managerId: 1,
                deadline: new Date("2025-06-07T17:00:00"),
                status: "Completed",
                progressPercent: 100,
                completedDate: new Date("2025-06-06T14:00:00"),
                qualityRating: 4,
            },
            {
                title: "Lên kế hoạch marketing quý 3",
                description: "Xây dựng kế hoạch marketing cho quý 3/2025 bao gồm ngân sách, kênh truyền thông và KPI mục tiêu.",
                assigneeId: 5,
                managerId: 2,
                deadline: new Date("2025-06-25T17:00:00"),
                status: "In Progress",
                progressPercent: 50,
                qualityRating: null,
            },
            {
                title: "Viết unit test cho module Tasks",
                description: "Viết unit test cho toàn bộ các hàm trong task.controller.js và task.service.js, đảm bảo coverage >= 80%.",
                assigneeId: 3,
                managerId: 1,
                deadline: new Date("2025-06-18T17:00:00"),
                status: "Pending",
                progressPercent: 0,
                qualityRating: null,
            },
            {
                title: "Đào tạo nhân viên mới",
                description: "Tổ chức buổi đào tạo onboarding cho 3 nhân viên mới về quy trình làm việc, công cụ sử dụng và nội quy công ty.",
                assigneeId: 6,
                managerId: 2,
                deadline: new Date("2025-06-12T17:00:00"),
                status: "Stuck",
                progressPercent: 20,
                qualityRating: null,
            },
            {
                title: "Tối ưu truy vấn database",
                description: "Phân tích và tối ưu các câu query chậm trong hệ thống, thêm index phù hợp và cải thiện hiệu năng tổng thể.",
                assigneeId: 4,
                managerId: 1,
                deadline: new Date("2025-06-22T17:00:00"),
                status: "In Progress",
                progressPercent: 45,
                qualityRating: null,
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Seed data thành công!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
