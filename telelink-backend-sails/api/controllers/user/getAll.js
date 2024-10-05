

module.exports = {
    friendlyName: 'Get all users',
  
    description: 'Lấy danh sách tất cả người dùng',
  
    exits: {
      success: {
        description: 'Danh sách người dùng được lấy thành công.',
      },
      serverError: {
        description: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.',
      },
    },
  
    getAllUsers: async function (req, res) {
      try {
        const users = await User.find();
        return res.json(users);
      } catch (err) {
        sails.log.error('Error fetching users:', err);
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng' });
      }
    },
  };
  