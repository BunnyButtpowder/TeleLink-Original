const ExcelJS = require('exceljs');

module.exports = {
  friendlyName: 'Export Excel',

  description: 'Export a file with specific headers',

  fn: async function (inputs) {
    let { res } = this
    try {
      // Tạo workbook và worksheet mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Báo cáo');
      worksheet.columns = [
        { header: 'Nơi cấp data', key: 'placeOfIssue', width: 20 },
        { header: 'Nhà mạng', key: 'networkName', width: 20 },
        { header: 'Phân loại data', key: 'category', width: 20 },
        { header: 'Số thuê bao', key: 'subscriberNumber', width: 20 },
        { header: 'Gói hiện tại', key: 'currentPackage', width: 20 },
        { header: 'Gói ưu tiên 1', key: 'priorityPackage1', width: 20 },
        { header: 'Gói ưu tiên 2', key: 'priorityPackage2', width: 20 },
        { header: 'Ngày đăng ký', key: 'registrationDate', width: 20 },
        { header: 'Ngày hết hạn', key: 'expirationDate', width: 20 },
        { header: 'Ghi chú', key: 'notes', width: 20 },
        { header: 'TKC', key: 'TKC', width: 15 },
        { header: 'APRU 3 tháng', key: 'APRU3Months', width: 20 },
        { header: 'Tiêu dùng n1', key: 'usageMonth1', width: 20 },
        { header: 'Tiêu dùng n2', key: 'usageMonth2', width: 20 },
        { header: 'Tiêu dùng n3', key: 'usageMonth3', width: 20 },
        { header: 'Tiêu dùng n4', key: 'usageMonth4', width: 20 },
        { header: 'Gói cước', key: 'Package', width: 20 },
        { header: 'Tiêu dùng TKC', key: 'totalTKCUsage', width: 20 },
        { header: 'Tiêu dùng thoại', key: 'voiceUsage', width: 20 },
        { header: 'Tiêu dùng data', key: 'dataUsage', width: 20 },
        { header: 'Dùng data ngoại gói', key: 'outOfPackageDataUsage', width: 20 },
        { header: 'Khác 1', key: 'other1', width: 20 },
        { header: 'Khác 2', key: 'other2', width: 20 },
        { header: 'Khác 3', key: 'other3', width: 20 },
      ];


      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

      // Ghi workbook vào response và kết thúc
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting Excel:', error);
      return res.serverError({ message: 'Có lỗi xảy ra khi xuất báo cáo Excel.' });
    }
  },
};
