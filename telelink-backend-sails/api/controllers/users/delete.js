module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'ID của người dùng cần xóa hoặc vô hiệu hóa',
    },
  },

  fn: async function (inputs) {
    let { id } = inputs;
    let { res } = this;

    try {

      const user = await User.findOne({ id: id }).populate('auth').populate('agency');
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      if (user.auth.role === 2) {

        if (user.auth) {
          await Auth.updateOne({ id: user.auth.id }).set({ isActive: false });
        }
        const relatedUsers = await User.find({ agency: user.agency.id });
        for (const relatedUser of relatedUsers) {
          await DataAssignment.destroy({ user: relatedUser.id });
        }
        console.log(relatedUsers);


        if (user.agency) {
          await User.update({ agency: user.agency.id }).set({ agency: null });
          await Data.update({ agency: user.agency.id }).set({ agency: null });
          await Agency.update({ id: user.agency.id }).set({ isDelete: true });
        }
        
        return res.ok({ message: 'Người dùng có vai trò 2 đã được vô hiệu hóa và cập nhật agency thành null' });
      }


      if (user.auth) {
        await Auth.destroyOne({ id: user.auth.id });
      }
      await User.destroyOne({ id: id });

      return res.json({ message: 'Xóa người dùng và thông tin xác thực thành công, agency đã được cập nhật thành null' });
    } catch (err) {
      return res.status(500).json({ error: 'Có lỗi xảy ra khi xử lý người dùng hoặc thông tin xác thực' });
    }
  },
};
