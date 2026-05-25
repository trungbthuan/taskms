import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { getRolePermissions } from "./rbac.middleware.js";

export const authenticate = async (req, res, next) => {
    try {
        // Đọc token từ cookie (ưu tiên) hoặc Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.redirect("/api/auth/login"); // hoặc res.status(401).json(...)
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin user từ DB, gắn vào req.user
        const user = await prisma.user.findUnique({
            where: { id: Number(decoded.userId) }, // ← ép kiểu về Int cho chắc
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                role: true,
                isActive: true,
                employeeId: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                        role: true,
                    },
                },
            },
        });

        if (!user || !user.isActive) {
            return res.redirect("/api/auth/login");
        }

        // Lấy role ưu tiên từ Employee, fallback về User
        const effectiveRole = user.employee?.role || user.role;

        // Gắn permissions vào req.user để controller dễ dùng
        req.user = {
            ...user,
            effectiveRole,
            permissions: getRolePermissions(effectiveRole),
        };

        next();
    } catch (error) {
        return res.redirect("/api/auth/login");
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
};
