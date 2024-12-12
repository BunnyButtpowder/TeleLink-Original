const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get revenue report by years",

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
        SELECT 
          agency,
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) AS year,
          SUM(revenue) AS total_revenue,
          a.name
      FROM 
          result r join agency a on r.agency = a.id
      GROUP BY 
          r.agency, 
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) 
      ORDER BY 
          agency, 
          year; 
        `;
    if (agencyId) {
      rawQuery = `
        SELECT 
          agency,
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) AS year,
          SUM(revenue) AS total_revenue,
          a.name
      FROM 
          result r join agency a on r.agency = a.id
      Where
        r.agency = $1
      GROUP BY 
          r.agency, 
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) 
      ORDER BY 
          agency, 
          year; 
        `;
    }
    groupedResults = await sails.sendNativeQuery(rawQuery, [agencyId]);
    console.log(groupedResults.rows);

    // const filteredResult = result.map((item) => ({
    //   revenue: item.revenue,
    //   agencyName: item.agency?.name,
    //   createdAt: item.createdAt,
    // }));

    // All done.
    return this.res.ok({
      message: `Revenue report:`,
      data: groupedResults.rows,
      count: groupedResults.rows.length,
    });
  },
};
