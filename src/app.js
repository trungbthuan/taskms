import express from 'express';
import 'dotenv/config';
import taskRoutes from './routes/task.routes.js';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import categoryRoutes from './routes/category.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================== MIDDLEWARE ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// ====================== VIEW ENGINE ======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main'); // ← Layout chính

// ====================== ROUTES ======================
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/categories', categoryRoutes);
app.get('/forbidden', (req, res) => {
    res.status(403).render('forbidden', {
        title: 'Không có quyền',
        user: req.user ?? null, // null nếu chưa đăng nhập
    });
});

app.get('/home', (req, res) => {
    res.render('./home');
});

export default app;
