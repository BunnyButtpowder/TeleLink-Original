const ExcelJS = require('exceljs');

module.exports = {

  exportResults: async function (req, res) {
    try {
      const { startDate, endDate } = req.body;
      const { role, id, agency  } = req.user; 
     

     
      let query = {};
      if (role === 3) {
        query.saleman = id; 
      } else if (role === 2) {
        query.agency = agency; 
      }
      if (startDate && endDate) {
        query.createdAt = { '>=': new Date(startDate), '<=': new Date(endDate) };
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
        { header: 'Mã dữ liệu', key: 'dataId', width: 15 },
        { header: 'Đại lý', key: 'agency', width: 30 },
        { header: 'Nhân viên kinh doanh', key: 'saleman', width: 30 },
        { header: 'Số thuê bao', key: 'subscriberNumber', width: 20 },
        { header: 'Gói cước', key: 'dataPackage', width: 15 },
        { header: 'Tên khách hàng', key: 'customerName', width: 25 },
        { header: 'Địa chỉ', key: 'address', width: 30 },
        { header: 'Ghi chú', key: 'note', width: 40 },
        { header: 'Doanh thu', key: 'revenue', width: 15 },
        { header: 'Ngày gọi lại', key: 'dateToCall', width: 20 },
      ];

      
      filteredResults.forEach((result, index) => {
        worksheet.addRow({
          index: index + 1,
          dataId: result.data_id?.id || 'N/A',
          agency: result.agency?.name || 'N/A',
          saleman: result.saleman?.fullname || 'N/A',
          subscriberNumber: result.subscriberNumber || 'N/A',
          dataPackage: result.dataPackage || 'N/A',
          customerName: result.customerName || 'N/A',
          address: result.address || 'N/A',
          note: result.note || 'N/A',
          revenue: result.revenue || 0,
          dateToCall: result.dateToCall || 'N/A',
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
  },
};
