module.exports = {
  inputs: {},

  exits: {
    success: {
      description: 'Danh sách người dùng và thông tin xác thực đã được lấy thành công.',
    },
    serverError: {
      description: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.',
    },
  },

  fn: async function (inputs) {
    let { res } = this;
    try {
      const users = await User.find().populate('auth').populate("agency");
      

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
    

      return res.ok({ data: allUsers , count: allUsers.length });
    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng hoặc thông tin xác thực.'});
    }
  }
};
