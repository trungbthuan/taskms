import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js"; // File cấu hình kết nối DB

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Tiêu đề công việc
    },
    description: {
        type: DataTypes.TEXT, // Nội dung chi tiết
    },
    assigneeId: {
        type: DataTypes.INTEGER, // ID nhân viên nhận việc
        allowNull: false,
    },
    managerId: {
        type: DataTypes.INTEGER, // ID người giao việc
        allowNull: false,
    },
    // --- QUẢN LÝ THỜI GIAN ---
    assignedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Ngày giờ giao
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false, // Thời gian phải hoàn thành
        validate: {
            isAfterNow(value) {
                if (new Date(value) < new Date()) {
                    throw new Error("Hạn chót không được là một ngày trong quá khứ!");
                }
            },
        },
    },
    completedDate: {
        type: DataTypes.DATE, // Thời gian thực tế kết thúc
    },
    // --- QUẢN LÝ TIẾN ĐỘ ---
    status: {
        type: DataTypes.ENUM("Pending", "In Progress", "Stuck", "Completed"),
        defaultValue: "Pending",
    },
    progressPercent: {
        type: DataTypes.INTEGER, // Tiến độ %
        defaultValue: 0,
    },
    issueNote: {
        type: DataTypes.TEXT, // Vướng mắc khi thực hiện
    },
    delayReason: {
        type: DataTypes.TEXT, // Lý do chưa hoàn thành (nếu trễ hạn)
    },
    // --- ĐÁNH GIÁ ---
    qualityRating: {
        type: DataTypes.INTEGER, // Thang điểm 1-10
        validate: { min: 1, max: 10 },
    },
    managerFeedback: {
        type: DataTypes.TEXT, // Đánh giá chất lượng của sếp
    },
});

export default Task;
