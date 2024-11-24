const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get top 10 saleman of the month or all-time",

  description: "Top 10 best selling salemans",

  inputs: {
    agencyId: {
      type: "string",
      required: false,
    },
    date: {
      type: "string",
      required: false,
    },
  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    let { agencyId, date } = inputs;

    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    } else {
      agencyId = undefined;
    }

    const criteria = {
      agency: agencyId
    }

    //định nghĩa tháng cần tìm
    let startDate,
      endDate = undefined;
    if (date) {
      const [month, year] = date.split("-");
      startDate = Date.parse(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
      endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));
      criteria.createdAt = { '>=': startDate, '<=': endDate };
    }

    const result = await Report.find({
      where: criteria,
    }).populate("agency");

    // All done.
    return this.res.ok({
      message: `Revenue report:`,
      data: result,
      count: result.length,
    });
  },
};
