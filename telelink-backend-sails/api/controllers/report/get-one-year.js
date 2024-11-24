const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get revenue report for 1 year ago",

  description: "A sum up of all call result in a year",

  inputs: {
    agencyId: {
      type: "string",
      required: false,
    },
  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    let { agencyId } = inputs;

    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    } else {
      agencyId = undefined;
    }

    //định nghĩa tháng cần tìm
    const month = new Date(Date.now()).getMonth();
    const year = new Date(Date.now()).getFullYear();
    let startDate = Date.parse(new Date(Date.UTC(year - 1, month, 1, 0, 0, 0)));
    let endDate = Date.parse(
      new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))
    );

    const result = await Report.find({
      createdAt: { ">=": startDate, "<=": endDate },
      agency: agencyId,
    }).populate("agency");

    // All done.
    return this.res.ok({
      message: `Revenue report:`,
      data: result,
      count: result.length,
    });
  },
};
