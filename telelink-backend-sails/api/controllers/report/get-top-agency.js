const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get top agency of the month or all-time",

  description: "Top agency best selling salemans",

  inputs: {
    date: {
      type: "string",
      required: false,
    },
    top:{
      type: "number",
      required: true
    }
  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    let { date, top } = inputs;
    //định nghĩa tháng cần tìm
    let startDate,
      endDate = undefined;
    if (date) {
      const [month, year] = date.split("-");
      startDate = Date.parse(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
      endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));
    }

    let rawQuery, groupedResults;
    rawQuery = `
    SELECT SUM(revenue) as 'Total revenue', agency.name
    FROM result
    JOIN agency on result.agency = agency.id
    WHERE 
      ($1 IS NULL OR result.createdAt > $1) AND 
      ($2 IS NULL OR result.createdAt < $2)
    GROUP BY result.agency
    ORDER BY SUM(revenue) DESC
    LIMIT $3
  `;

    // Execute the query
    groupedResults = await sails.sendNativeQuery(rawQuery, [
      startDate || null,
      endDate || null,
      top
    ]);

    console.log(groupedResults.rows);

    // All done.
    return res.ok({
      message: `Top ${top} agency of the company in ${date}:`,
      data: groupedResults.rows,
      // count: result.length,
    });
  },
};
