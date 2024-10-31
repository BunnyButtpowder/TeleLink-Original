module.exports = {

  friendlyName: 'Create',

  description: 'Create blacklist.',

  inputs: {
    SDT: {
      type: 'string',
      required: true,
      description: 'Số điện thoại của người bị đưa vào danh sách đen'
    },
    note: {
      type: 'string',
      allowNull: true,
      description: 'Ghi chú về lý do hoặc chi tiết bổ sung'
    },
    userID: {
      type: 'number',
      required: true,
      description: 'ID của người dùng liên quan đến blacklist'
    },
  },

 

  fn: async function (inputs) {
    const { res } = this;
    try {
      const { SDT, note, userID } = inputs;
      const existingEntry = await Blacklist.findOne({ SDT: SDT });
      if (existingEntry) {
        
        return res.conflict({ message: "SDT đã nằm trong danh sách đen." });
      }
      const newBlacklistEntry = await Blacklist.create({
        SDT: SDT,
        note: note,
        user: userID,
      }).fetch();

     return res.status(201).json(newBlacklistEntry)

    } catch (error) {
      return res.serverError({
        error: 'Đã xảy ra lỗi khi tạo blacklist.',
        details: error.message
      });
    }
  }

};
