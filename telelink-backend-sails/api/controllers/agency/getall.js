module.exports = {
    inputs: {},
    exits: {
      success: {
        description: 'Lấy danh sách chi nhánh thành công.',
      },
      notFound: {
        description: 'Không tìm thấy chi nhánh nào.',
      },
      serverError: {
        description: 'Lỗi hệ thống.',
      },
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const agencies = await Agency.find({ isDelete: false });
        if (!agencies.length) {
          return res.notFound({ message: "Không tìm thấy chi nhánh nào." });
        }
        return res.json(agencies);
      } catch (error) {
        sails.log.error('Error in getAll:', error);
        return res.serverError({ message: "Lỗi hệ thống.", error });
      }
    }
  };
  