const _ = require('lodash');

module.exports = {
  friendlyName: 'Get all network and categorize with counts',

  description: 'Lấy tất cả dữ liệu, phân loại theo nhà mạng và đếm số lượng trong mỗi loại.',

  fn: async function (inputs) {
    const { res } = this;

    try {
      const allData = await Data.find({
        agency: null,
        isDelete : false
      });
      const categorizedData = _.groupBy(allData, 'networkName');

      const categorizedWithCounts = _.mapValues(categorizedData, (items) => ({
        count: items.length,
        // items,
      }));

      return res.status(200).json(categorizedWithCounts);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
