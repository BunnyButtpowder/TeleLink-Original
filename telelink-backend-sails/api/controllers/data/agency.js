

module.exports = {

  friendlyName: 'View branch data',

  description: 'Xem các dữ liệu đã được phân bổ cho chi nhánh theo agency ID.',

  inputs: {
    agencyId: {
      type: 'string',
      required: true,
     
    }
  },

  fn: async function (inputs) {
    const { agencyId } = inputs;

    const AgencyExit = await Agency.findOne({ id: agencyId });

    if (!AgencyExit) {
      return this.res.notFound({ message: "không tìm thấy chi nhánh." });
    }
    const branchData = await Data.find({ agency: agencyId });

    return this.res.ok({
      message: `Đây là danh sách data của agency với ID ${agencyId}`,
      data: branchData,
    });
  }

};
