const { fail, log } = require("grunt");

module.exports = {
  friendlyName: "Get revenue report by months",

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
    let year = parseInt(date); 

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

      // End date: End of today
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

      // Start date: 12 months (1 year) ago from the current date
      const oneYearAgo = new Date(
        Date.UTC(
          now.getUTCFullYear() - 1,
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        )
      );
      startDate = Date.parse(oneYearAgo);
      year = now.getFullYear();
    } else {
      
      startDate = Date.parse(new Date(Date.UTC(year, 0, 1, 0, 0, 0))); 
      endDate = Date.parse(new Date(Date.UTC(year, 11, 31, 23, 59, 59)));
    }
    
    let rawQuery, groupedResults;

    rawQuery = `
    WITH RECURSIVE months AS (
    SELECT ${year} AS year, 1 AS month
    UNION ALL
    SELECT year, month + 1
    FROM months
    WHERE month < 12
  )
  SELECT 
    m.year,
    m.month,
    COALESCE(SUM(r.revenue), 0) AS total_revenue
  FROM 
    months m
    LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = m.year AND MONTH(FROM_UNIXTIME(r.createdAt / 1000)) = m.month
  WHERE
    (r.createdAt IS NULL OR (r.createdAt > $1 AND r.createdAt < $2))
  GROUP BY 
    m.year, 
    m.month
  ORDER BY 
    m.year, 
    m.month;
        `;
    if (agencyId) {
      rawQuery = `
      WITH RECURSIVE months AS (
      SELECT ${year} AS year, 1 AS month
      UNION ALL
      SELECT year, month + 1
      FROM months
      WHERE month < 12
    )
    SELECT 
      m.year,
      m.month,
      COALESCE(SUM(r.revenue), 0) AS total_revenue
    FROM 
      months m
      LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = m.year AND MONTH(FROM_UNIXTIME(r.createdAt / 1000)) = m.month
    WHERE
      (r.agency = $1 AND r.createdAt > $2 AND r.createdAt < $3) OR r.createdAt IS NULL
    GROUP BY 
      m.year, 
      m.month
    ORDER BY 
      m.year, 
      m.month;
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
