import { prisma } from "../src/config/prisma.js";

async function main() {
    await prisma.job.createMany({
        data: [
            { title: "Thiết kế giao diện Dashboard", description: "Thiết kế UI/UX cho trang Dashboard quản lý công việc, bao gồm các biểu đồ thống kê và danh sách công việc gần đây." },
            { title: "Phát triển API Authentication", description: "Xây dựng API đăng ký, đăng nhập, JWT token và refresh token cho hệ thống." },
            { title: "Báo cáo doanh thu tháng 5", description: "Tổng hợp và phân tích doanh thu tháng 5, so sánh với cùng kỳ năm ngoái và lập báo cáo trình ban giám đốc." },
            { title: "Tích hợp cổng thanh toán VNPay", description: "Tích hợp VNPay vào hệ thống, hỗ trợ thanh toán qua thẻ nội địa, quốc tế và ví điện tử." },
            { title: "Chăm sóc khách hàng mới tháng 6", description: "Liên hệ và chăm sóc danh sách 50 khách hàng tiềm năng mới, ghi nhận phản hồi và cập nhật vào CRM." },
            { title: "Fix bug phân quyền người dùng", description: "Kiểm tra và sửa lỗi phân quyền: nhân viên có thể truy cập trang admin, cần xử lý middleware và route guard." },
            { title: "Lên kế hoạch marketing quý 3", description: "Xây dựng kế hoạch marketing cho quý 3/2025 bao gồm ngân sách, kênh truyền thông và KPI mục tiêu." },
            { title: "Viết unit test cho module Tasks", description: "Viết unit test cho toàn bộ các hàm trong task.controller.js và task.service.js, đảm bảo coverage >= 80%." },
            { title: "Đào tạo nhân viên mới", description: "Tổ chức buổi đào tạo onboarding cho 3 nhân viên mới về quy trình làm việc, công cụ sử dụng và nội quy công ty." },
            { title: "Tối ưu truy vấn database", description: "Phân tích và tối ưu các câu query chậm trong hệ thống, thêm index phù hợp và cải thiện hiệu năng tổng thể." },
        ],
    });

    console.log("✅ Cập nhật categoryId thành công!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
