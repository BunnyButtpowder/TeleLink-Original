

module.exports = {

  friendlyName: 'View branch data',

  description: 'Xem các dữ liệu đã được phân bổ cho chi nhánh theo agency ID.',

  inputs: {
    agencyId: {
      type: 'string',
      required: true,
      custom: async (value) => {
        // Kiểm tra xem agencyId có tồn tại trong hệ thống hay không
        const agency = await Agency.findOne({ id: value });
        return !!agency; 
      }
    }
  },

  fn: async function (inputs) {
    const { agencyId } = inputs;


    const branchData = await Data.find({ agency: agencyId });

    return this.res.json({
      message: `Đây là danh sách data của agency với ID ${agencyId}`,
      data: branchData,
    });
  }

};
