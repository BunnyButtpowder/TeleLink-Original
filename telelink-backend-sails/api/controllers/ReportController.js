const ExcelJS = require('exceljs');

module.exports = {
  exportReport: async function (req, res) {
    try {
      // Fetch users and ensure correct population
      const reports = await Report.find().populate('agency');
      console.log('Users:', reports);
      
      if (!reports || reports.length === 0) {
        return res.notFound({ message: 'Không có dữ liệu để xuất báo cáo.' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách người dùng');

      // Define columns
      worksheet.columns = [
        { header: 'STT', key: 'index', width: 10 },
        { header: 'Đại lý', key: 'agency', width: 30 },
        { header: 'Tổng đơn hàng', key: 'total', width: 15 },
        { header: 'Đã đồng ý', key: 'accept', width: 15 },
        { header: 'Đã từ chối', key: 'reject', width: 15 },
        { header: 'Không nghe máy', key: 'unanswered', width: 15 },
        { header: 'Không liên lạc được', key: 'unavailable', width: 20 },
        { header: 'Xử lý lại', key: 'rehandle', width: 15 },
        { header: 'Mất đơn hàng', key: 'lost', width: 15 },
        { header: 'Doanh thu', key: 'revenue', width: 15 },
        { header: 'Tỷ lệ thành công (%)', key: 'successRate', width: 20 },
        { header: 'Tỷ lệ thất bại (%)', key: 'failRate', width: 20 },
        { header: 'Thời gian', key: 'updatedAt', width: 20 },
      ];
      

      // Add user data rows
      reports.forEach((report, index) => {
        worksheet.addRow({
          index: index + 1,
          agency: report.agency.name || 'N/A', 
          total: report.total || 0,
          accept: report.accept || 0,
          reject: report.reject || 0,
          unanswered: report.unanswered || 0,
          unavailable: report.unavailable || 0,
          rehandle: report.rehandle || 0,
          lost: report.lost || 0,
          revenue: report.revenue || 0,
          successRate: report.successRate || 0,
          failRate: report.failRate || 0,
          updatedAt: report.updatedAt ? new Date(report.updatedAt).toLocaleString() : 'N/A',
        });
      });

      // Apply bold to the header row
      worksheet.getRow(1).font = { bold: true };

      // Send the Excel file as response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Doanhthu.xlsx');
      
      // Write to response and end
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error('Error exporting report:', err);
      return res.serverError({ message: 'Lỗi khi xuất báo cáo Excel.' });
    }
  },
};
