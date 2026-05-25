import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createTask, updateProgress, evaluateTask, getEmployeeReport, getTask, getUpdateProgress, getTaskList, getDashboard, getTaskDetail, deleteTask, getTaskEdit, updateTask, getJobNew, createJob, getHome } from "../controllers/task.controller.js";
import { isManager, isEmployee } from "../middlewares/rbac.middleware.js";

const router = express.Router();

// Trang chủ
router.get("/home", getHome);

// Tất cả đều phải đăng nhập
router.use(authenticate);
router.get("/list", getTaskList); // ← filter theo role trong controller
router.get("/new", isManager, getTask); // ← chỉ Manager+ mới tạo được
router.post("/assign", isManager, createTask);
router.get("/:id/detail", getTaskDetail); // ← filter trong controller
router.get("/:id/progress", getUpdateProgress); // ← tất cả cập nhật được
router.post("/:id/progress", updateProgress);
router.get("/:id/edit", isManager, getTaskEdit);
router.post("/:id/edit", isManager, updateTask);
router.delete("/:id/delete", isManager, deleteTask);
router.get("/dashboard", getDashboard);
router.get("/new-job", isManager, getJobNew); // ← hiển thị form tạo công việc mới
router.post("/create-job", isManager, createJob); // ← xử lý tạo công việc mới

//lấy danh sách công việc của nhân viên
//router.get("/list", authenticate, getTaskList);

// Trang chủ
//router.get("/home", getHome);

// Giao việc
//router.get("/new", authenticate, getTask);
//router.post("/assign", authenticate, createTask);

// Cập nhật tiến độ
//router.get("/:id/progress", authenticate, getUpdateProgress);
//router.post("/:id/progress", authenticate, updateProgress);

//Xem chi tiết công việc
//router.get("/:id/detail", authenticate, getTaskDetail);

// Sếp đánh giá công việc
router.patch("/:id/evaluate", authenticate, evaluateTask);

// Lấy thống kê công việc của một nhân viên cụ thể
router.get("/employee/:assigneeId/stats", authenticate, getEmployeeReport);

// Dashboard
//router.get("/dashboard", authenticate, getDashboard);

// Xóa công việc
//router.delete("/:id/delete", authenticate, deleteTask);

// Sửa công việc
//router.get("/:id/edit", authenticate, getTaskEdit); // ← hiển thị form sửa
//router.post("/:id/edit", authenticate, updateTask);

// Danh sách công việc
//router.get("/new-job", authenticate, getJobNew); // ← hiển thị form tạo công việc mới
//router.post("/create-job", authenticate, createJob); // ← xử lý tạo công việc mới

export default router;
