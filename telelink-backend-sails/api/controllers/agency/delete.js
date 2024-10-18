module.exports = {
    inputs: {
      id: { type: 'number', required: true },
    },
    exits: {
      success: {
        description: 'Đã xóa chi nhánh thành công.',
      },
      notFound: {
        description: 'Chi nhánh không tồn tại.',
      },
      serverError: {
        description: 'Lỗi hệ thống.',
      },
    },
  
    fn: async function (inputs) {
      let { id } = inputs;
      let { res } = this;
      try {
        const agency = await Agency.findOne({ id });
        if (!agency) {
          return res.notFound({ message: "Chi nhánh không tồn tại." });
        }
        if (agency.isDelete) {
          return res.badRequest({ message: "Chi nhánh đã được xóa." });
        }
        const updatedAgency = await Agency.updateOne({ id }).set({ isDelete: true });
        if (!updatedAgency) {
          return res.serverError({ message: "Không thể xóa chi nhánh." });
        }
        return res.json({ message: "Chi nhánh đã được xóa thành công.", agency: updatedAgency });
      } catch (error) {
        sails.log.error('Error in delete:', error);
        return res.serverError({ message: "Lỗi hệ thống.", error });
      }
    }
  };
  