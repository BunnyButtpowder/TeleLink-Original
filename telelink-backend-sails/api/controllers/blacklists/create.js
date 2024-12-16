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

      // Find the Data table row with the matching subscriberNumber
      const matchingData = await Data.findOne({
        subscriberNumber: { endsWith: last9Digits },
      });

      if (matchingData) {
        // Update the isBlock to true for the matching record in Data table
        const updatedEntry = await Data.update({
          id: matchingData.id, // Use the exact ID of the matching record
        })
        .set({
          isBlock: true,
        })
        .fetch();

        // Delete the corresponding entry in DataAssignment
        const deletedAssignments = await DataAssignment.destroy({
          data: matchingData.id, // Use the exact ID of the matching record
        }).fetch();

        return res.status(201).json({
          message: `Blacklist entry created. Data entry with subscriberNumber ${SDT} was updated to isBlock=true, and corresponding DataAssignment entry was deleted.`,
          blacklist: newBlacklistEntry,
          updatedData: updatedEntry,
          deletedAssignments: deletedAssignments,
        });
      }

      return res.status(201).json({
        message: 'Blacklist entry created. No matching Data entry found to update.',
        blacklist: newBlacklistEntry,
      });

    } catch (error) {
      console.log(error);
      return res.serverError({
        error: 'Đã xảy ra lỗi khi tạo blacklist.',
        details: error.message,
      });
    }
  },
};
