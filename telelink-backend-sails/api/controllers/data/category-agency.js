const _ = require('lodash');

module.exports = {
  friendlyName: 'Get all data and categorize with counts by agency',

  description: 'Lấy tất cả dữ liệu, phân loại theo loại và đếm số lượng trong mỗi loại của chi nhánh',

  inputs: {
    agencyId: {
      type: 'string',
      required: true,

    },
  },

  fn: async function (inputs) {
    const { res } = this;

    try {
      const { agencyId } = inputs;
      const allData = await Data.find({
        agency: agencyId
      });
      const categorizedData = _.groupBy(allData, 'category');

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
