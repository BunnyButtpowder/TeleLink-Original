const ExcelJS = require('exceljs');

module.exports = {
    inputs: {
        startDate: { type: 'string', required: false },
        endDate: { type: 'string', required: false },
    },
    fn: async function (inputs) {
        try {
            let { res , req } = this;          
            let { startDate, endDate } = inputs;
            const { role, id, agency } = req.user;

            let query = {};
            if (role === 3) {
                query.saleman = id;
            } else if (role === 2) {
                query.agency = agency;
            }

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            
                query.createdAt = { '>=': start, '<=': end };
            }
            


            const results = await Result.find(query)
                .populate('agency')
                .populate('saleman');


            const filteredResults = results.filter((result) => result.result === 1);
            console.log('Filtered Results:', filteredResults);


            if (!filteredResults || filteredResults.length === 0) {
                return res.notFound({ message: 'Không có dữ liệu để xuất báo cáo.' });
            }


            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Danh sách kết quả');


            worksheet.columns = [
                { header: 'STT', key: 'index', width: 10 },
                
                { header: 'Đại lý', key: 'agency', width: 30 },
                { header: 'Nhân viên kinh doanh', key: 'saleman', width: 30 },
                { header: 'Số thuê bao', key: 'subscriberNumber', width: 20 },
                { header: 'Gói cước', key: 'dataPackage', width: 15 },
                { header: 'Tên khách hàng', key: 'customerName', width: 25 },
                { header: 'Địa chỉ', key: 'address', width: 30 },
                { header: 'Ghi chú', key: 'note', width: 40 },
                { header: 'Doanh thu', key: 'revenue', width: 15 },
                
            ];


            filteredResults.forEach((result, index) => {
                worksheet.addRow({
                    index: index + 1,
                    
                    agency: result.agency?.name || 'N/A',
                    saleman: result.saleman?.fullName || 'N/A',
                    subscriberNumber: result.subscriberNumber || 'N/A',
                    dataPackage: result.dataPackage || 'N/A',
                    customerName: result.customerName || 'N/A',
                    address: result.address || 'N/A',
                    note: result.note || 'N/A',
                    revenue: result.revenue || 0,
                    
                });
            });


            worksheet.getRow(1).font = { bold: true };


            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Ketqua_filtered.xlsx');


            await workbook.xlsx.write(res);
            res.end();
        } catch (err) {

            console.error('Error exporting results:', err);
            return res.serverError({ message: 'Lỗi khi xuất báo cáo Excel.' });
        }
    }
};
