// src/routes/stats.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isManager } from '../middlewares/rbac.middleware.js';
import { getStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/', authenticate, isManager, getStats);

export default router;
