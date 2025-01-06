const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
    importPackage: async function (req, res, filePath, id) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            // Hàm chuẩn hóa chuỗi
            function normalizeString(str) {
                return str
                    ?.normalize('NFD')
                    ?.replace(/[\u0300-\u036f]/g, '')
                    ?.replace(/\s+/g, '')
                    ?.replace(/đ/g, 'd')
                    ?.toLowerCase();
            }

            const headers = worksheet[0].map(header => normalizeString(header));
            console.log('Headers sau khi chuẩn hóa:', headers);

            const columnMapping = {
                'magoi': 'title',
                'nhamang': 'provider',
                'loaihinh': 'type',
                'giagoi': 'price',
                'uudai': 'discount'
            };

            const headerIndexes = {};
            const missingColumns = [];
            for (const [normalizedHeader, field] of Object.entries(columnMapping)) {
                const index = headers.indexOf(normalizeString(normalizedHeader));
                if (index === -1) {
                    missingColumns.push(normalizedHeader);
                } else {
                    headerIndexes[field] = index;
                }
            }

            if (missingColumns.length > 0) {
                throw new Error(`Không tìm thấy cột cho trường: ${missingColumns.join(', ')}`);
            }

            // Loại bỏ các dòng trống
            const cleanedWorksheet = worksheet.slice(1).filter((row) =>
                row.some((cell) => cell && cell.toString().trim() !== '')
            );

            console.log(`Tổng số dòng ban đầu: ${worksheet.length}`);
            console.log(`Tổng số dòng sau khi loại bỏ dòng trống: ${cleanedWorksheet.length}`);

            if (cleanedWorksheet.length === 0) {
                throw new Error("Không có dữ liệu hợp lệ sau khi loại bỏ các dòng trống.");
            }

            const validData = [];
            const skippedRows = [];

            for (let i = 0; i < cleanedWorksheet.length; i++) {
                const row = cleanedWorksheet[i];
                const title = row[headerIndexes['title']] || '';

                if (!title) {
                    skippedRows.push(i + 2); // Dòng bị bỏ qua
                    continue;
                }

                const existingPackage = await Package.findOne({ where: { title } });

                // Xóa gói đã tồn tại nếu có
                if (existingPackage) {
                    await Package.destroy({ id: existingPackage.id });
                }

                let price = row[headerIndexes['price']] || '0';
                price = String(price).replace(/,/g, ''); 
                price = parseFloat(price);

                validData.push({
                    title: title,
                    provider: row[headerIndexes['provider']] || '',
                    type: row[headerIndexes['type']] || '',
                    price: price,
                    discount: row[headerIndexes['discount']] || '',
                    user: id
                });
            }

            if (validData.length === 0) {
                throw new Error("Không có dữ liệu hợp lệ để nhập.");
            }

            // Tạo dữ liệu mới
            const createResult = await Package.createEach(validData).fetch();

            // Xóa file sau khi xử lý xong
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return res.ok({
                message: `Xử lý hoàn tất: Đã thêm mới ${createResult.length} bản ghi.`,
                skippedRows,
            });

        } catch (err) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            console.error('Lỗi trong quá trình nhập dữ liệu packages:', err.message);
            return res.serverError({
                message: 'Có lỗi xảy ra trong quá trình nhập dữ liệu packages.',
                error: err.message,
            });
        }
    },
};
