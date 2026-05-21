import { Sequelize } from "sequelize";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg(connectionString);

export const prisma = new PrismaClient({ adapter });

// Khởi tạo kết nối với Neon.tech
// Lưu ý: Neon yêu cầu kết nối SSL
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Cần thiết cho các môi trường như Neon/Render
        },
    },
    logging: false, // Tắt log SQL thuần để màn hình terminal sạch hơn
});
