module.exports = {
  inputs: {
    searchTerm: {
      type: 'string',
      required: false,
    },
    searchTermAuth: {
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
    role: {
      type: 'number',
      required: false,
    },
    agency: {
      type: 'number',
      required: false,
    },
    page: {
      type: 'number',
      required: false,
      defaultsTo: 1,
      min: 1,
    },
    limit: {
      type: 'number',
      required: false,
      defaultsTo: 10,
      min: 1,
    },
  },

  fn: async function (inputs) {
    let { res } = this;
    try {
      const { searchTerm, searchTermAuth, sort, order, role, agency, page, limit } = inputs;
      const sortOrder = sort && order ? `${sort} ${order}` : undefined;

      const whereClause = { isDelete: false };
      if (searchTerm) {
        whereClause.or = [
          { phoneNumber: { like: `%${searchTerm}%` } },
          { address: { like: `%${searchTerm}%` } },
          { fullName: { like: `%${searchTerm}%` } },
        ];
      }

      if (agency) {
        whereClause['agency'] = agency;
      }

      const skip = (page - 1) * limit;

      // Đếm tổng số bản ghi
      const totalCount = await User.count({ where: whereClause });

      let users;
      if (['username', 'email'].includes(sort)) {
        users = await User.find({
          where: whereClause,
          skip: skip,
          limit: limit,
        })
          .populate('auth')
          .populate('agency');
      } else {
        users = await User.find({
          where: whereClause,
          sort: sortOrder,
          skip: skip,
          limit: limit,
        })
          .populate('auth')
          .populate('agency');
      }

      if (searchTermAuth) {
        const authUsers = await Auth.find({
          where: {
            or: [
              { username: { like: `%${searchTermAuth}%` } },
              { email: { like: `%${searchTermAuth}%` } },
            ],
          },
        });

        const authUserIds = authUsers.map(authUser => authUser.id);
        users = users.filter(user => authUserIds.includes(user.auth.id));
      }

      if (role) {
        users = users.filter(user => user.auth && user.auth.role === role);
      }

      const sortOrder1 = sort && order ? order : 'asc';
      if (sort === 'username') {
        users.sort((a, b) => {
          const nameA = a.auth.username.toLowerCase();
          const nameB = b.auth.username.toLowerCase();
          if (sortOrder1 === 'asc') {
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          } else {
            return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
          }
        });
      }
      if (sort === 'email') {
        users.sort((a, b) => {
          const nameA = a.auth.email.toLowerCase();
          const nameB = b.auth.email.toLowerCase();
          if (sortOrder1 === 'asc') {
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          } else {
            return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
          }
        });
      }

      if (!users || users.length === 0) {
        return res.notFound({ message: 'Không tìm thấy người dùng nào.' });
      }

      const allUsers = users.map(user => {
        return {
          ...user,
          agency: user.agency ? { name: user.agency.name } : null,
          auth: {
            email: user.auth.email,
            role: user.auth.role,
            username: user.auth.username,
            isActive: user.auth.isActive,
          },
        };
      });

      const totalPages = Math.ceil(totalCount / limit);

      return res.ok({
        data: allUsers,
        count: allUsers.length,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
      });
    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng hoặc thông tin xác thực.' });
    }
  },
};
