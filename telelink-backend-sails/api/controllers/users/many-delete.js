module.exports = {
    inputs: {
      ids: {
        type: 'ref', 
        required: true,
        description: 'Danh sách ID của người dùng cần xóa',
      },
    },
  
    fn: async function (inputs) {
      let { ids } = inputs;
      let { res } = this;
  
      try {
       
        const users = await User.find({ id: { in: ids } }).populate('auth');
  
        if (users.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy người dùng nào với ID đã cho' });
        }
  
        const authIds = users.map(user => user.auth?.id).filter(Boolean);
        if (authIds.length > 0) {
          await Auth.destroy({ id: { in: authIds } });
        }
        await User.destroy({ id: { in: ids } });
  
        return res.json({ message: 'Đã xóa tất cả người dùng và thông tin xác thực thành công' });
      } catch (err) {
        return res.status(500).json({ error: 'Có lỗi xảy ra khi xóa người dùng hoặc thông tin xác thực', details: err.message });
      }
    },
  };
  