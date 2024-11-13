module.exports = {


  inputs: {
    userID: {
      type: 'number',
      required: true,
      description: 'ID của người dùng để lấy danh sách đen'
    },
    searchTerm: {
      type: 'string',
      description: 'Từ khóa tìm kiếm trong số điện thoại, ghi chú hoặc tên người tạo',
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
      const { userID, searchTerm, sort, order } = inputs;

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;
      let blacklistData
      if (searchTerm) {
        blacklistData = await Blacklist.find({
          where: {
            user: userID,
            or: [
              { SDT: { contains: searchTerm } },
              { note: { contains: searchTerm } },
            ],
          },
          sort: sortOrder,
        }).populate('user');

        if (blacklistData.length === 0) {
          blacklistData = await Blacklist.find({
            where: {
              user: userID,
            },
            sort: sortOrder,
          }).populate('user');

          blacklistData = blacklistData.filter(item =>
            item.user && item.user.fullName && item.user.fullName.includes(searchTerm)
          );
        }
      } else {
        blacklistData = await Blacklist.find({
          where: {
            user: userID,
          },
          sort: sortOrder,
        }).populate('user');
      }

      if (blacklistData.length === 0) {
        return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
      }
      blacklistData = blacklistData.map(item => ({
        ...item,
        user: item.user ? { fullName: item.user.fullName, role: item.user.auth } : null
      }));

      return res.json({ data: blacklistData, count: blacklistData.length });

    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách blacklist.' });
    }
  }

};
