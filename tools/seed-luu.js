import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.employee.createMany({
        data: [
            { name: "Nguyễn Văn A", email: "nva@company.com", role: "Manager", department: "Quản lý" },
            { name: "Trần Thị B", email: "ttb@company.com", role: "Employee", department: "Thiết kế" },
            { name: "Lê Văn C", email: "lvc@company.com", role: "Employee", department: "Lập trình" },
        ],
    });
    console.log("Đã khởi tạo dữ liệu nhân viên mẫu!");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
