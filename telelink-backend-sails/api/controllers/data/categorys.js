const _ = require('lodash');

module.exports = {
  friendlyName: 'Update to get categories by network operator',

  description: 'Cập nhật lấy categories theo nhà mạng',
  
  inputs: {
    network: {
      type: "string",
      required: true
    }
  },
  fn: async function (inputs) {
    const { res } = this;

    const { network } = inputs;

    try {
      const allData = await Data.find({
        agency: null,
        isDelete : false,
        networkName: network 
      });

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
