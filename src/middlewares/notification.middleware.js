// src/middlewares/notification.middleware.js
import { prisma } from '../config/prisma.js';

export const loadNotifications = async (req, res, next) => {
    try {
        if (!req.user) return next(); // chưa đăng nhập → bỏ qua

        const { effectiveRole, employeeId } = req.user;

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // +1 ngày

        // ── Điều kiện lọc theo role ──────────────
        let whereClause = {
            status: { notIn: ['Completed'] }, // chưa hoàn thành
            deadline: { lte: tomorrow }, // deadline ≤ ngày mai
        };

        if (effectiveRole === 'Employee' && employeeId) {
            whereClause.assigneeId = employeeId; // chỉ việc của mình
        } else if (effectiveRole === 'Manager' && employeeId) {
            whereClause.managerId = employeeId; // việc phòng mình
        }
        // Admin → thấy tất cả

        // ── Lấy danh sách task sắp hết hạn ──────
        const urgentTasks = await prisma.task.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                deadline: true,
                status: true,
                assignee: { select: { name: true } },
            },
            orderBy: { deadline: 'asc' },
            take: 10, // tối đa 10 thông báo
        });

        // ── Phân loại: quá hạn vs sắp hết hạn ──
        const overdue = urgentTasks.filter((t) => new Date(t.deadline) < now);
        const dueSoon = urgentTasks.filter((t) => new Date(t.deadline) >= now);

        // ── Gắn vào res.locals — EJS dùng được ──
        res.locals.notifications = {
            total: urgentTasks.length,
            overdue: overdue.length,
            dueSoon: dueSoon.length,
            tasks: urgentTasks,
        };
    } catch (error) {
        console.error('Notification middleware error:', error.message);
        // Không block request nếu lỗi
        res.locals.notifications = {
            total: 0,
            overdue: 0,
            dueSoon: 0,
            tasks: [],
        };
    }

    next();
};
