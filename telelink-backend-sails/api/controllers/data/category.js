const _ = require('lodash');

module.exports = {
  friendlyName: 'Get all data and categorize with counts',

  description: 'Lấy tất cả dữ liệu, phân loại theo loại và đếm số lượng trong mỗi loại.',

  fn: async function (inputs) {
    const { res } = this;

    try {
      const allData = await Data.find({
        agency: null,
        // networkName:"Viettel"
      });

      // Kiểm tra xem có dữ liệu không
      if (!allData || allData.length === 0) {
        return res.ok({ message: 'Không có dữ liệu nào được tìm thấy.' });
      }

      const categorizedData = _.groupBy(allData, 'category');
      const categorizedWithCounts = _.mapValues(categorizedData, (items) => ({
        count: items.length,
      }));

      return res.ok(categorizedWithCounts);
    } catch (error) {
      // Ghi lại lỗi để theo dõi
      console.log('Error fetching data:', error);
      return res.serverError({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
