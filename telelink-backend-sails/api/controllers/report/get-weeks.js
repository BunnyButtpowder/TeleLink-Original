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
    let startDate = Date.parse(new Date(Date.UTC(year, month, 1, 0, 0, 0)));
    let endDate = Date.parse(
      new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))
    );

    let rawQuery, groupedResults;
      rawQuery = `
        SELECT sum(revenue)
        FROM result
        WHERE agency = $1 AND createdAt > $2 AND createdAt < $3
        GROUP BY agency
        `;
      groupedResults = await sails.sendNativeQuery(rawQuery, [
        user.agency,
        startDate,
        endDate,
      ]);


    const filteredResult = result.map((item) => ({
      revenue: item.revenue,
      agencyName: item.agency?.name,
      createdAt: item.createdAt,
    }));

    // All done.
    return this.res.ok({
      message: `Revenue report:`,
      // data: filteredResult,
      // count: filteredResult.length,
    });
  },
};
