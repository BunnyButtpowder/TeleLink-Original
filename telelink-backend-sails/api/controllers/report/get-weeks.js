const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get revenue report by weeks",

  description: "A sum up of all call result in a year",

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
    let startDate, endDate;
    //định nghĩa tháng cần tìm
    if (!date) {
      const now = new Date(); // Current date and time
      endDate = Date.parse(
        new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            23,
            59,
            59
          )
        )
      ); // End of today
      startDate = Date.parse(
        new Date(endDate - 28 * 24 * 60 * 60 * 1000)
      );
    } else {
      const [month, year] = date.split("-");
      startDate = Date.parse(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
      endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));
    }

    let rawQuery, groupedResults;

    rawQuery = `
        SELECT 
          agency,
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) AS year,
          WEEK(FROM_UNIXTIME(r.createdAt / 1000)) AS week, 
          SUM(revenue) AS total_revenue,
          a.name
      FROM 
          result r join agency a on r.agency = a.id
      Where
        r.createdAt > $1 AND r.createdAt < $2
      GROUP BY 
          r.agency, 
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)),
          WEEK(FROM_UNIXTIME(r.createdAt / 1000))
      ORDER BY 
          r.agency, 
          year, 
          week;
        `;
    if (agencyId) {
      rawQuery = `
        SELECT 
          agency,
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)) AS year,
          WEEK(FROM_UNIXTIME(r.createdAt / 1000)) AS week, 
          SUM(revenue) AS total_revenue,
          a.name
      FROM 
          result r join agency a on r.agency = a.id
      Where
        r.agency = $1 AND r.createdAt > $2 AND r.createdAt < $3
      GROUP BY 
          r.agency, 
          YEAR(FROM_UNIXTIME(r.createdAt / 1000)), 
          WEEK(FROM_UNIXTIME(r.createdAt / 1000))
      ORDER BY 
          r.agency, 
          year, 
          week;
        `;
      groupedResults = await sails.sendNativeQuery(rawQuery, [
        agencyId,
        startDate,
        endDate,
      ]);
    } else {
      groupedResults = await sails.sendNativeQuery(rawQuery, [
        startDate,
        endDate,
      ]);
    }

    return this.res.ok({
      message: `Revenue report:`,
      data: groupedResults.rows,
      count: groupedResults.rows.length,
    });
  },
};
