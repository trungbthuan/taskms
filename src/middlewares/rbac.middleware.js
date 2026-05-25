// src/middlewares/rbac.middleware.js

// ─── Kiểm tra role cụ thể ───────────────────
export const requireRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.effectiveRole || req.user?.employee?.role || req.user?.role;

        if (!userRole) {
            return res.redirect("/auth/login");
        }

        if (!roles.includes(userRole)) {
            if (req.headers.accept?.includes("text/html")) {
                // ✅ Gắn user vào res.locals để forbidden.ejs dùng được
                res.locals.user = req.user ?? null;
                return res.status(403).render("forbidden", {
                    title: "Không có quyền",
                    user: req.user ?? null,
                });
            }
            return res.status(403).json({
                message: `Bạn không có quyền. Yêu cầu: ${roles.join(" hoặc ")}`,
            });
        }

        next();
    };
};
// ─── Shortcut middleware ────────────────────
export const isAdmin = requireRole("Admin");
export const isManager = requireRole("Admin", "Manager");
export const isEmployee = requireRole("Admin", "Manager", "Employee");

// ─── Helper dùng trong EJS ──────────────────
export const getRolePermissions = (role) => ({
    canManageUsers: role === "Admin",
    canManageTasks: ["Admin", "Manager"].includes(role),
    canViewAllTasks: ["Admin", "Manager"].includes(role),
    canViewReports: ["Admin", "Manager"].includes(role),
    canEditSettings: role === "Admin",
    canAssignTasks: ["Admin", "Manager"].includes(role),
    canDeleteTasks: ["Admin", "Manager"].includes(role),
    canViewOwnTasks: true, // tất cả đều xem được việc của mình
});
