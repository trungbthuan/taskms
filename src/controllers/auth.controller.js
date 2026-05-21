import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

// ====================== test ======================
export const testPage = async (req, res) => {
    try {
        res.render("../views/home", {
            title: "Trang dùng để test",
            message: "Đang test thành công",
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// ─── ĐĂNG KÝ ───────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
        }

        // Kiểm tra username đã tồn tại chưa
        const existing = await prisma.user.findUnique({
            where: { username },
        });

        if (existing) {
            const field = existing.username === username ? "Username" : "Email";
            return res.status(409).json({ message: `${field} đã được sử dụng` });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        await prisma.user.create({
            data: { username, email, password: hashedPassword, fullName },
        });

        // Redirect sang trang login
        res.redirect("login?registered=true");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ─── ĐĂNG NHẬP ─────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        // Tìm user theo username
        const user = await prisma.user.findFirst({
            where: { username, isActive: true },
        });

        if (!user) {
            return res.status(401).json({ message: "Username hoặc mật khẩu không đúng" });
        }

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Username hoặc mật khẩu không đúng" });
        }

        // Cập nhật lastLoginAt
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Tạo JWT token & lưu vào cookie
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Loại bỏ password trước khi truyền vào view
        const { password: _, ...safeUser } = user;
        res.render("../views/home", {
            title: "Trang Chủ",
            message: "Đăng nhập thành công",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getLogin = async (req, res) => {
    res.render("../views/auth/login", { title: "Đăng Nhập" });
};

export const getRegister = async (req, res) => {
    res.render("../views/auth/register", { title: "Đăng Ký" });
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/api/auth/login?logout=true");
};
