module.exports = {
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

  fn: async function (inputs) {
    let { res } = this;
    try {
      
      const { searchTerm, sort, order } = inputs;

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;

      let users;
      if (searchTerm) {
        users = await User.find({
          where: {
            or: [
              { phoneNumber: { like: `%${searchTerm}%` } },
              { address: { like: `%${searchTerm}%` } },
              { fullName: { like: `%${searchTerm}%` } }
            ],
          },
          sort: sortOrder,
        }).populate('auth').populate('agency');
      } else {
        users = await User.find({
          sort: sortOrder,
        }).populate('auth').populate('agency');
      }
      if (!users || users.length === 0) {
        return res.notFound({ message: "Không tìm thấy người dùng nào." });
      }

      const allUsers = users.map(user => {
        return {
          ...user,
          agency: user.agency ? { name: user.agency.name } : null,
          auth: {
            email: user.auth.email,
            role: user.auth.role,
            username: user.auth.username
          },

        };
      });
      return res.ok({ data: allUsers, count: allUsers.length });
    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng hoặc thông tin xác thực.' });
    }
  }
};
