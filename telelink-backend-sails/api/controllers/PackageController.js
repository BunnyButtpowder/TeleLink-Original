const XLSX = require('xlsx');
const fs = require('fs');


module.exports = {
    importPackage: async function (req, res, filePath, id) {
        try {

            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            function normalizeString(str) {
                return str
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '')
                    .replace(/đ/g, 'd')
                    .toLowerCase();
            }

            const headers = worksheet[0].map(header => normalizeString(header));
            console.log('Headers after normalization:', headers);

            const columnMapping = {
                'magoi': 'title',
                'nhamang': 'provider',
                'loaigoi': 'type',
                'giagoi': 'price'
            };

            const headerIndexes = {};
            for (const [normalizedHeader, field] of Object.entries(columnMapping)) {
                const index = headers.indexOf(normalizeString(normalizedHeader));
                if (index !== -1) {
                    headerIndexes[field] = index;
                } else {
                    return res.badRequest({ message: `Không tìm thấy cột cho trường: ${normalizedHeader}` });
                }
            }

            for (let i = 1; i < worksheet.length; i++) {
                const row = worksheet[i];
                let title = row[headerIndexes['title']] || '';
            
                const existingPackage = await Package.findOne({ where: { title } });
            
                if (existingPackage) {
                    await Package.destroy({ id: existingPackage.id });  
                }
            
                
                let price = row[headerIndexes['price']] || '0';
                price = String(price).replace(/,/g, '');  
                price = parseFloat(price);
            
                await Package.create({
                    title: title,
                    provider: row[headerIndexes['provider']] || '',
                    type: row[headerIndexes['type']] || '',
                    price: price,
                    user: id
                });
            }
            
            fs.unlinkSync(filePath);

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
