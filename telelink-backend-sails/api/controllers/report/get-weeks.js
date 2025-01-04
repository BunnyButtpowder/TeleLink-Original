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
    WITH RECURSIVE weeks AS (
    SELECT YEAR(FROM_UNIXTIME(${startDate} / 1000)) AS year, WEEK(FROM_UNIXTIME(${startDate} / 1000), 3) AS week
    UNION ALL
    SELECT 
      CASE WHEN week < 52 THEN year ELSE year + 1 END,
      CASE WHEN week < 52 THEN week + 1 ELSE 1 END
    FROM weeks
    WHERE (year < YEAR(FROM_UNIXTIME(${endDate} / 1000))) OR (year = YEAR(FROM_UNIXTIME(${endDate} / 1000)) AND week < WEEK(FROM_UNIXTIME(${endDate} / 1000), 3))
    LIMIT 1000
  )
  SELECT 
    w.year,
    w.week,
    COALESCE(SUM(r.revenue), 0) AS total_revenue
  FROM 
    weeks w
    LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = w.year AND WEEK(FROM_UNIXTIME(r.createdAt / 1000), 3) = w.week
  WHERE
    r.createdAt IS NULL OR (r.createdAt > $1 AND r.createdAt < $2)
  GROUP BY 
    w.year, 
    w.week
  ORDER BY 
    w.year, 
    w.week;
        `;
    if (agencyId) {
      rawQuery = `
    WITH RECURSIVE weeks AS (
      SELECT YEAR(FROM_UNIXTIME(${startDate} / 1000)) AS year, WEEK(FROM_UNIXTIME(${startDate} / 1000), 3) AS week
      UNION ALL
      SELECT 
        CASE WHEN week < 52 THEN year ELSE year + 1 END,
        CASE WHEN week < 52 THEN week + 1 ELSE 1 END
      FROM weeks
      WHERE (year < YEAR(FROM_UNIXTIME(${endDate} / 1000))) OR (year = YEAR(FROM_UNIXTIME(${endDate} / 1000)) AND week < WEEK(FROM_UNIXTIME(${endDate} / 1000), 3))
      LIMIT 1000
    )
    SELECT 
      w.year,
      w.week,
      COALESCE(SUM(r.revenue), 0) AS total_revenue
    FROM 
      weeks w
      LEFT JOIN result r ON YEAR(FROM_UNIXTIME(r.createdAt / 1000)) = w.year AND WEEK(FROM_UNIXTIME(r.createdAt / 1000), 3) = w.week
      LEFT JOIN agency a ON r.agency = a.id
    WHERE
      (r.agency = $1 AND r.createdAt > $2 AND r.createdAt < $3) OR r.createdAt IS NULL
    GROUP BY 
      w.year, 
      w.week,
      a.name
    ORDER BY 
      w.year, 
      w.week;
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
