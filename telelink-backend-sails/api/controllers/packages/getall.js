module.exports = {

  friendlyName: 'GetallPackages',

  description: 'Lấy tất cả các gói dịch vụ với tìm kiếm và sắp xếp.',

  inputs: {
    searchTerm: {
      type: 'string',
      required: false,
    },
    sort: {
      type: 'string',
      required: false,
    },
    order: {
      type: 'string',
      required: false,
      isIn: ['asc', 'desc'],
    },
  },

  fn: async function (inputs, exits) {
    let { res } = this;
    try {
      const { searchTerm, sort, order } = inputs;

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;

      let packageData;
      if (searchTerm) {
        packageData = await Package.find({
          where: {
            isDelete: false,
            or: [
              { code: { like: `%${searchTerm}%` } },
              { title: { like: `%${searchTerm}%` } },
              { provider: { like: `%${searchTerm}%` } },
            ],
          },
          sort: sortOrder,
        });
      } else {
        packageData = await Package.find({
          where: { isDelete: false },
          sort: sortOrder,
        });
      }
      if (packageData.length === 0) {
        return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
      }

      return res.ok({
        message: 'Đây là danh sách các gói dịch vụ',
        data: packageData,
        count: packageData.length,
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
