import { prisma } from '../config/prisma.js';

export const getJobNew = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        res.render('../views/categories/job-new', {
            title: 'Tạo công việc mới',
            user: req.user,
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

export const createJob = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        await prisma.job.create({
            data: {
                title,
                description: description || null,
                categoryId: Number(categoryId),
            },
        });
        res.redirect('/api/categories/new-job'); // ← sau khi tạo xong, quay về form tạo công việc mới
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
