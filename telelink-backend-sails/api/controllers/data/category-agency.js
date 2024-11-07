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

      const assignData = await DataAssignment.find({});
      const assignDataIds = assignData.map(item => item.data); 
      // console.log(assignDataIds)

      const filteredData = allData.filter(item => !assignDataIds.includes(item.id));

      const categorizedData = _.groupBy(filteredData, 'category');

      const categorizedWithCounts = _.mapValues(categorizedData, (items) => ({
        count: items.length,
        // items,
      }));

      return res.ok(categorizedWithCounts);
    } catch (error) {
      console.log(error)
      return res.serverError({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
