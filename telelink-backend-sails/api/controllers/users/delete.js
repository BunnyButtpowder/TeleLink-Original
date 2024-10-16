module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'ID của người dùng cần xóa',
    },
  },

  fn: async function (inputs) {
    let { id } = inputs;
    let { res } = this;

    try {
      const user = await User.findOne({ id: id }).populate('auth');
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      if (user.auth) {
        await Auth.destroyOne({ id: user.auth.id });
      }
      await User.destroyOne({ id: id });
      return res.json({ message: 'Xóa người dùng và thông tin xác thực thành công' });
    } catch (err) {
      return res.status(500).json({ error: 'Có lỗi xảy ra khi xóa người dùng hoặc thông tin xác thực' });
    }
  },
};
