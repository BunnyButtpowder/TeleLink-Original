module.exports = {

  friendlyName: 'Get all blacklist',

  description: 'Lấy tất cả mục blacklist với tìm kiếm và sắp xếp.',

  inputs: {

    searchTerm: {
      type: 'string',
      description: 'Từ khóa tìm kiếm trong số điện thoại hoặc ghi chú',
      required: false,
    },
    sort: {
      type: 'string',
      description: 'Tên thuộc tính để sắp xếp (VD: SDT hoặc note)',
      required: false,
    },
    order: {
      type: 'string',
      description: 'Hướng sắp xếp: asc hoặc desc',
      required: false,
      isIn: ['asc', 'desc'],
    },
  },

  fn: async function (inputs) {
    let { res } = this;
    try {
      const { searchTerm, sort, order } = inputs;

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;

      let blacklistData;
      if (searchTerm) {
        blacklistData = await Blacklist.find({
          where: {
            or: [
              { SDT: { like: `%${searchTerm}%` } },
              { note: { like: `%${searchTerm}%` } },
            ],
          },
          sort: sortOrder,
        });
      } else {

        blacklistData = await Blacklist.find({

          sort: sortOrder,
        });
      }

      if (blacklistData.length === 0) {
        return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
      }

      return res.ok({
        data: blacklistData,
        count: blacklistData.length
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu blacklist.' });
    }
  }
};
