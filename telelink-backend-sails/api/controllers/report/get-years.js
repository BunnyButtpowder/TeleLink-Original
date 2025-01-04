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
    let startDate, endDate;
    //định nghĩa tháng cần tìm
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
    );

    const fiveYearAgo = new Date(
      Date.UTC(
        now.getUTCFullYear() - 4,
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0
      )
    );
    startDate = Date.parse(fiveYearAgo);

    let rawQuery, groupedResults;

    rawQuery = `
      WITH RECURSIVE years AS (
        SELECT YEAR(FROM_UNIXTIME(${startDate} / 1000)) AS year
        UNION ALL
        SELECT year + 1
        FROM years
        WHERE year < YEAR(FROM_UNIXTIME(${endDate} / 1000))
      )
      SELECT 
        y.year,
        COALESCE(SUM(r.revenue), 0) AS total_revenue
      FROM 
        years y
        LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = y.year
        LEFT JOIN agency a ON r.agency = a.id
      WHERE
        r.createdAt IS NULL OR (r.createdAt > $1 AND r.createdAt < $2)
      GROUP BY 
        y.year,
        a.name
      ORDER BY 
        y.year;
        `;
    if (agencyId) {
      rawQuery = `
      WITH RECURSIVE years AS (
          SELECT YEAR(FROM_UNIXTIME(${startDate} / 1000)) AS year
          UNION ALL
          SELECT year + 1
          FROM years
          WHERE year < YEAR(FROM_UNIXTIME(${endDate} / 1000))
        )
        SELECT 
          y.year,
          COALESCE(SUM(r.revenue), 0) AS total_revenue
        FROM 
          years y
          LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = y.year
          LEFT JOIN agency a ON r.agency = a.id
        WHERE
          (r.agency = $1 AND r.createdAt > $2 AND r.createdAt < $3) OR r.createdAt IS NULL
        GROUP BY 
          y.year,
          a.name
        ORDER BY 
          y.year;
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
