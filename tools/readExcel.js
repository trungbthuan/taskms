import ExcelJS from "exceljs";

async function excelToJsonFile() {
    const workbook = new ExcelJS.Workbook();
    try {
        await workbook.xlsx.readFile("../public/upload/students.xlsx");
        const worksheet = workbook.getWorksheet(1);

        const jsonData = [];
        let headers = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const rowData = row.values;
            if (rowNumber === 1) {
                headers = rowData.slice(1);
            } else {
                const rowObject = {};
                headers.forEach((header, index) => {
                    rowObject[header] = rowData[index + 1]; // rowData[0] là undefined, nên bắt đầu từ index 1
                });
                jsonData.push(rowObject);
            }
        });

        console.log("Dữ liệu Excel dưới dạng JSON:");
        console.log(jsonData);

        return jsonData;
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw error;
    }
}

async function readExcelFile() {
    // 1. Khởi tạo một Workbook mới
    const workbook = new ExcelJS.Workbook();
    try {
        // 2. Đọc file excel từ đường dẫn
        await workbook.xlsx.readFile("../public/upload/students.xlsx");

        // 3. Lấy sheet đầu tiên (có thể lấy theo tên: workbook.getWorksheet('Sheet1'))
        const worksheet = workbook.getWorksheet(1); // Get the first worksheet

        console.log(`--- Đang đọc dữ liệu từ sheet: ${worksheet.name} ---`);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const rowData = row.values;
            //console.log(`--- Hàng ${rowNumber}: ${rowData.join(", ")} ---`);
            console.log(`Dòng ${rowNumber}:`, rowData.slice(1));
        });

        return worksheet;
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw error;
    }
}

readExcelFile();
