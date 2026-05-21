import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createTask, updateProgress, evaluateTask, getEmployeeReport, getTask, getUpdateProgress, getTaskList, getDashboard, getTaskDetail, deleteTask, getTaskEdit, updateTask, getJobNew, createJob } from "../controllers/task.controller.js";

const router = express.Router();

//lấy danh sách công việc của nhân viên
router.get("/list", authenticate, getTaskList);

// Giao việc
router.get("/new", authenticate, getTask);
router.post("/assign", authenticate, createTask);

// Cập nhật tiến độ
router.get("/:id/progress", authenticate, getUpdateProgress);
router.post("/:id/progress", authenticate, updateProgress);

//Xem chi tiết công việc
router.get("/:id/detail", authenticate, getTaskDetail);

// Sếp đánh giá công việc
router.patch("/:id/evaluate", authenticate, evaluateTask);

// Lấy thống kê công việc của một nhân viên cụ thể
router.get("/employee/:assigneeId/stats", authenticate, getEmployeeReport);

// Dashboard
router.get("/dashboard", authenticate, getDashboard);

// Xóa công việc
router.delete("/:id/delete", authenticate, deleteTask);

// Sửa công việc
router.get("/:id/edit", authenticate, getTaskEdit); // ← hiển thị form sửa
router.post("/:id/edit", authenticate, updateTask);

// Danh sách công việc
router.get("/new-job", authenticate, getJobNew); // ← hiển thị form tạo công việc mới
router.post("/create-job", authenticate, createJob); // ← xử lý tạo công việc mới

export default router;
