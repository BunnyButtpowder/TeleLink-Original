const ExcelJS = require('exceljs');

module.exports = {
  exportReport: async function (req, res) {
    try {
      // Fetch users and ensure correct population
      const reports = await Report.find().populate('agency');
      
      // Log the data to ensure correct population
      console.log('Users:', reports);
      
      if (!reports || reports.length === 0) {
        return res.notFound({ message: 'Không có dữ liệu để xuất báo cáo.' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách người dùng');

      // Define columns
      worksheet.columns = [
        { header: 'STT', key: 'index', width: 10 },
        { header: 'Agency', key: 'agency', width: 30 },
        { header: 'Total Orders', key: 'total', width: 15 },
        { header: 'Accepted', key: 'accept', width: 15 },
        { header: 'Rejected', key: 'reject', width: 15 },
        { header: 'Unanswered', key: 'unanswered', width: 15 },
        { header: 'Unavailable', key: 'unavailable', width: 20 },
        { header: 'Rehandle', key: 'rehandle', width: 15 },
        { header: 'Lost', key: 'lost', width: 15 },
        { header: 'Revenue', key: 'revenue', width: 15 },
        { header: 'Success Rate (%)', key: 'successRate', width: 20 },
        { header: 'Fail Rate (%)', key: 'failRate', width: 20 },
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
