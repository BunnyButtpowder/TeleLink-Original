const _ = require('lodash');

module.exports = {

  fn: async function (inputs) {
    const { res } = this;

    try {
      const allData = await Data.find({
        // agency: null,
        isDelete : false
      });

      if (!allData || allData.length === 0) {
        return res.ok({ message: 'Không có dữ liệu nào được tìm thấy.' });
      }

      const data = _.groupBy(allData, 'placeOfIssue');
      const placeOfIssue = _.mapValues(data, (items) => ({
        count: items.length,
      }));

      return res.ok(placeOfIssue);
    } catch (error) {
      console.log('Error fetching data:', error);
      return res.serverError({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
