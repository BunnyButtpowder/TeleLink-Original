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
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '')
                    .replace(/đ/g, 'd')
                    .toLowerCase();
            }

            const headers = worksheet[0].map(header => normalizeString(header));
            console.log('Headers sau khi chuẩn hóa:', headers);

            const columnMapping = {
                'magoi': 'title',
                'nhamang': 'provider',
                'loaihinh': 'type',
                'giagoi': 'price'
            };

            const headerIndexes = {};
            const missingColumns = [];
            for (const [normalizedHeader, field] of Object.entries(columnMapping)) {
                const index = headers.indexOf(normalizeString(normalizedHeader));
                if (index !== -1) {
                    headerIndexes[field] = index;
                } else {
                    missingColumns.push(normalizedHeader);
                }
            }

            if (missingColumns.length > 0) {
                return res.badRequest({ message: `Không tìm thấy cột cho trường: ${missingColumns.join(', ')}` });
            }

            // Loại bỏ các dòng trống
            const cleanedWorksheet = worksheet.slice(1).filter((row) => 
                row.some((cell) => cell && cell.toString().trim() !== '')
            );

            console.log(`Tổng số dòng ban đầu: ${worksheet.length}`);
            console.log(`Tổng số dòng sau khi loại bỏ dòng trống: ${cleanedWorksheet.length}`);

            if (cleanedWorksheet.length === 0) {
                return res.badRequest({ message: "Không có dữ liệu hợp lệ sau khi loại bỏ các dòng trống." });
            }

            // Xử lý từng dòng dữ liệu
            for (let i = 0; i < cleanedWorksheet.length; i++) {
                const row = cleanedWorksheet[i];
                const title = row[headerIndexes['title']] || '';

                if (!title) {
                    console.log(`Bỏ qua dòng ${i + 2} vì không có tên gói.`);
                    continue;
                }

                const existingPackage = await Package.findOne({ where: { title } });

                // Xóa gói đã tồn tại nếu có
                if (existingPackage) {
                    await Package.destroy({ id: existingPackage.id });
                }

                let price = row[headerIndexes['price']] || '0';
                price = String(price).replace(/,/g, '');  // Xóa dấu phẩy
                price = parseFloat(price);

                await Package.create({
                    title: title,
                    provider: row[headerIndexes['provider']] || '',
                    type: row[headerIndexes['type']] || '',
                    price: price,
                    user: id
                });
            }

            // Xóa file đã tải lên sau khi xử lý xong
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return res.ok({ message: 'Dữ liệu packages được nhập thành công' });

        } catch (err) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            console.log(err);
            return res.serverError({ message: 'Có lỗi xảy ra trong quá trình nhập dữ liệu packages.', err });
        }
    },
};
