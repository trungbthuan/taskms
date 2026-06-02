// src/controllers/stats.controller.js
import { prisma } from '../config/prisma.js';

export const getStats = async (req, res) => {
    try {
        const { effectiveRole, employeeId } = req.user;
        const currentYear = new Date().getFullYear();

        // ── Điều kiện lọc theo role ──────────────
        let roleFilter = {};
        if (effectiveRole === 'Employee' && employeeId) {
            roleFilter = { assigneeId: employeeId };
        } else if (effectiveRole === 'Manager' && employeeId) {
            roleFilter = { managerId: employeeId };
        }

        // ── 1. Công việc theo từng tháng trong năm ──
        const tasksByMonth = await prisma.task.groupBy({
            by: ['assignedDate'],
            where: {
                ...roleFilter,
                assignedDate: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`),
                },
            },
            _count: { id: true },
        });

        // Gom nhóm theo tháng
        const monthlyData = Array(12).fill(0);
        tasksByMonth.forEach((item) => {
            const month = new Date(item.assignedDate).getMonth(); // 0-11
            monthlyData[month] += item._count.id;
        });

        // ── 2. Công việc hoàn thành theo tháng ──────
        const completedByMonth = await prisma.task.groupBy({
            by: ['completedDate'],
            where: {
                ...roleFilter,
                status: 'Completed',
                completedDate: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`),
                    not: null,
                },
            },
            _count: { id: true },
        });

        const completedData = Array(12).fill(0);
        completedByMonth.forEach((item) => {
            if (item.completedDate) {
                const month = new Date(item.completedDate).getMonth();
                completedData[month] += item._count.id;
            }
        });

        // ── 3. Thống kê theo trạng thái ─────────────
        const statusStats = await prisma.task.groupBy({
            by: ['status'],
            where: roleFilter,
            _count: { id: true },
        });

        const statusMap = {
            Pending: 0,
            'In Progress': 0,
            Completed: 0,
            Stuck: 0,
        };
        statusStats.forEach((s) => {
            statusMap[s.status] = s._count.id;
        });

        // ── 4. Top nhân viên hiệu suất cao ──────────
        const topEmployees = await prisma.employee.findMany({
            take: 5,
            include: {
                tasks: {
                    where: { ...roleFilter },
                    select: { status: true, progressPercent: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        const employeeStats = topEmployees
            .map((emp) => {
                const total = emp.tasks.length;
                const completed = emp.tasks.filter(
                    (t) => t.status === 'Completed',
                ).length;
                const avgProgress =
                    total > 0
                        ? Math.round(
                              emp.tasks.reduce(
                                  (s, t) => s + t.progressPercent,
                                  0,
                              ) / total,
                          )
                        : 0;
                return {
                    name: emp.name,
                    department: emp.department || 'Chưa phân phòng',
                    total,
                    completed,
                    rate: total > 0 ? Math.round((completed / total) * 100) : 0,
                    avgProgress,
                };
            })
            .sort((a, b) => b.rate - a.rate);

        // ── 5. Tổng quan ─────────────────────────────
        const [total, inProgress, completed, stuck, overdue] =
            await Promise.all([
                prisma.task.count({ where: roleFilter }),
                prisma.task.count({
                    where: { ...roleFilter, status: 'In Progress' },
                }),
                prisma.task.count({
                    where: { ...roleFilter, status: 'Completed' },
                }),
                prisma.task.count({
                    where: { ...roleFilter, status: 'Stuck' },
                }),
                prisma.task.count({
                    where: {
                        ...roleFilter,
                        status: { notIn: ['Completed'] },
                        deadline: { lt: new Date() },
                    },
                }),
            ]);

        const completionRate =
            total > 0 ? Math.round((completed / total) * 100) : 0;

        res.render('../views/stats/stats', {
            title: 'Thống kê',
            user: req.user,
            currentYear,
            chartData: {
                monthly: JSON.stringify(monthlyData),
                completed: JSON.stringify(completedData),
                status: JSON.stringify(statusMap),
            },
            summary: {
                total,
                inProgress,
                completed,
                stuck,
                overdue,
                completionRate,
            },
            employeeStats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
