module.exports = {
  friendlyName: 'Getall',

  description: 'Get all blacklist entries for users in a specific agency.',

  inputs: {
    agencyID: {
      type: 'number',
      required: true,
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
      const { agencyID, searchTerm, sort, order } = inputs;

      const usersInAgency = await User.find({ agency: agencyID }).select(['id']);
      if (usersInAgency.length === 0) {
        return res.notFound({ message: "Không có người dùng nào thuộc chi nhánh này." });
      }
      // console.log(usersInAgency)

      const userIds = usersInAgency.map(user => user.id);

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;

      let blacklistData
      if (searchTerm) {
        blacklistData = await Blacklist.find({
          where: {
            user: { in: userIds },
            or: [
              { SDT: { like: `%${searchTerm || ''}%` } },
              { note: { like: `%${searchTerm || ''}%` } },
              {}
            ]
          },
          sort: sortOrder,
        }).populate('user');

        console.log(blacklistData)



        blacklistData = blacklistData.filter(item =>
          (item.user && item.user.fullName && item.user.fullName.includes(searchTerm)) ||
          (item.SDT.includes(searchTerm)) ||
          (item.note.includes(searchTerm))
        );
      } else {
        blacklistData = await Blacklist.find({
          where: {
            user: { in: userIds },
            or: [
              { SDT: { like: `%${searchTerm || ''}%` } },
              { note: { like: `%${searchTerm || ''}%` } },

            ]
          },
          sort: sortOrder,
        }).populate('user');

      }



      if (blacklistData.length === 0) {
        return res.notFound({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
      }

      blacklistData = blacklistData.map(item => ({
        ...item,
        user: item.user ? { fullName: item.user.fullName, role: item.user.auth } : null
      }));

      return res.ok({ data: blacklistData, count: blacklistData.length });

    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách blacklist.' });
    }
  }
};
