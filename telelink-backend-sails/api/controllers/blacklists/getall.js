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
              { SDT: { contains: searchTerm } },
              { note: { contains: searchTerm } },
            ],
          },
          sort: sortOrder,
        }).populate('user');
      
        // If no results found in SDT or note, search in user.fullName
        if (blacklistData.length === 0) {
          blacklistData = await Blacklist.find({
            sort: sortOrder,
          }).populate('user');
      
          // Filter results where user.fullName matches the searchTerm
          blacklistData = blacklistData.filter(item =>
            item.user && item.user.fullName && item.user.fullName.includes(searchTerm)
          );
        }
      } else {
        // No search term, just get all blacklist data
        blacklistData = await Blacklist.find({
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
