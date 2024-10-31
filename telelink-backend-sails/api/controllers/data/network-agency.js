const _ = require('lodash');

module.exports = {
  friendlyName: 'Get all network and categorize with counts by agency',

  description: 'Lấy tất cả dữ liệu, phân loại theo nhà mạng và đếm số lượng trong mỗi loại.',

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
      const existingAgency = await Agency.findOne({ id: agencyId });
      if (!existingAgency) {
        return res.notFound({ message: "Chi nhánh không tồn tại." });
      }
      const allData = await Data.find({
        agency: agencyId
      });
      if (allData.length === 0) {
        return res.notFound({ message: "Không có dữ liệu." });
      }
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
