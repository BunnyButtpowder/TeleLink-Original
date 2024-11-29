module.exports = {
  friendlyName: 'Create',

  description: 'Create blacklist.',

  inputs: {
    SDT: {
      type: 'string',
      required: true,
      description: 'Số điện thoại của người bị đưa vào danh sách đen',
    },
    note: {
      type: 'string',
      allowNull: true,
      description: 'Ghi chú về lý do hoặc chi tiết bổ sung',
    },
    userID: {
      type: 'number',
      required: true,
      description: 'ID của người dùng liên quan đến blacklist',
    },
  },

  fn: async function (inputs) {
    const { res } = this;
    try {
      const { SDT, note, userID } = inputs;
      const existingEntry = await Blacklist.findOne({ SDT });
      if (existingEntry) {
        return res.conflict({ message: 'SDT đã nằm trong danh sách đen.' });
      }

      // Create the new blacklist entry
      const newBlacklistEntry = await Blacklist.create({
        SDT,
        note,
        user: userID,
      }).fetch();

      // Extract the last 9 digits of the SDT
      const last9Digits = SDT.slice(-9);

      // Find and delete rows in the Data table with matching subscriberNumber
      const matchingData = await Data.find({
        subscriberNumber: { endsWith: last9Digits },
      });

      if (matchingData.length > 0) {
        const deletedEntries = await Data.destroy({
          id: { in: matchingData.map((data) => data.id) },
        }).fetch();

        return res.status(201).json({
          message: `Blacklist entry created. ${deletedEntries.length} matching Data entries were deleted.`,
          blacklist: newBlacklistEntry,
          deletedData: deletedEntries,
        });
      }

      return res.status(201).json({
        message: 'Blacklist entry created. No matching Data entries found to delete.',
        blacklist: newBlacklistEntry,
      });

    } catch (error) {
      return res.serverError({
        error: 'Đã xảy ra lỗi khi tạo blacklist.',
        details: error.message,
      });
    }
  },
};
