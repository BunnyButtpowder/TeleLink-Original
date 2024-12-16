module.exports = {
    inputs: {
      agencyId: { type: 'number', required: true },
      searchTerm: { type: 'string', required: false },
      sort: { type: 'string', required: false },
      order: { type: 'string', required: false, isIn: ['asc', 'desc'] }, 
    },
  
    fn: async function (inputs) {
      let { req, res } = this;
      try {
        const { agencyId, searchTerm, sort, order } = inputs;
        const existingAgency = await Agency.findOne({ id: agencyId });
        if (!existingAgency) {
          return res.notFound({ message: "Chi nhánh không tồn tại." });
        }

        const whereClause = { agency: agencyId };
  

        if (searchTerm) {
          whereClause.or = [
            { fullName: { like: `%${searchTerm}%` } },
            { phoneNumber: { like: `%${searchTerm}%` } },
            { address: { like: `%${searchTerm}%` } },
          ];
        }
  
        const sortOrder = sort && order ? `${sort} ${order}` : undefined;
 
        const employees = await User.find({
          where: whereClause,
          sort: sortOrder,
        }).populate('auth');

        if (employees.length === 0) {
            return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
          }
  

        const staffMembers = employees
          .filter(user => user.auth && user.auth.role === 3)
          .map(user => ({
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            dob: user.dob,
            avatar: user.avatar,
            gender: user.gender,
            createdAt: user.createdAt,
            auth: {
              email: user.auth.email,
              role: user.auth.role,
              username: user.auth.username,
              isActive: user.auth.isActive
            },
          }));
  
        return res.ok({ employees: staffMembers, count: staffMembers.length });
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách nhân viên.', err });
      }
    },
  };
  