

module.exports = {
    inputs: {
    },
  
    exits: {
      success: {
        description: 'Danh sách người dùng đã được lấy thành công.',
      },
      serverError: {
        description: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.',
      },
    },
  
    fn: async function (inputs) {
      let { res } = this;
  
      try {
    
        const users = await User.find();
  
    
        if (!users || users.length === 0) {
          return res.notFound({ message: "Không tìm thấy người dùng nào." });
        }
  
        return res.json(users);
      } catch (err) {
        sails.log.error('Error fetching users:', err);
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng' });
      }
    },
  };
  