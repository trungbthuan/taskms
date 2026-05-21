import { prisma } from "../config/prisma.js";

// ─── DANH SÁCH ─────────────────────────────────────────
export const getEmployeeList = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                departmentRel: { select: { id: true, name: true } },
                tasks: { select: { id: true } },
                managedTasks: { select: { id: true } },
            },
            orderBy: { name: "asc" },
        });

        const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });

        res.render("../views/employees/employee-list", {
            title: "Quản lý nhân sự",
            user: req.user,
            employees,
            departments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── THÊM MỚI ──────────────────────────────────────────
export const createEmployee = async (req, res) => {
    try {
        const { name, email, role, department, departmentId, avatar } = req.body;

        const existing = await prisma.employee.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "Email đã tồn tại" });
        }

        await prisma.employee.create({
            data: {
                name,
                email,
                role: role || "Employee",
                department: department || null,
                departmentId: departmentId ? Number(departmentId) : null,
                avatar: avatar || null,
            },
        });

        res.redirect("/api/employees/list");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── SỬA ───────────────────────────────────────────────
export const getEmployeeEdit = async (req, res) => {
    try {
        const [employee, departments] = await Promise.all([prisma.employee.findUnique({ where: { id: Number(req.params.id) } }), prisma.department.findMany({ orderBy: { name: "asc" } })]);

        if (!employee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });

        res.render("../views/employees/employee-edit", {
            title: "Chỉnh sửa nhân viên",
            user: req.user,
            employee,
            departments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { name, email, role, department, departmentId, avatar } = req.body;

        await prisma.employee.update({
            where: { id: Number(req.params.id) },
            data: {
                name,
                email,
                role,
                department: department || null,
                departmentId: departmentId ? Number(departmentId) : null,
                avatar: avatar || null,
            },
        });

        res.redirect("/api/employees/list");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── XÓA ───────────────────────────────────────────────
export const deleteEmployee = async (req, res) => {
    try {
        await prisma.employee.delete({ where: { id: Number(req.params.id) } });
        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
