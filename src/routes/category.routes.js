import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getJobNew, createJob } from '../controllers/category.controller.js';
import { isManager, isEmployee } from '../middlewares/rbac.middleware.js';

const router = express.Router();

// Tất cả đều phải đăng nhập
router.use(authenticate);

router.get('/new-job', isManager, getJobNew); // ← hiển thị form tạo công việc mới
router.post('/create-job', isManager, createJob); // ← xử lý tạo công việc mới

export default router;
