const { fail } = require("grunt");

module.exports = {
  friendlyName: "Total revenue",

  description: "Total revenue",

  inputs: {

  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    //định nghĩa tháng cần tìm
    let startDate,
      endDate = undefined;
    const now = new Date();
    const month = now.getUTCMonth();
    const year = now.getUTCFullYear();
    startDate = Date.parse(new Date(Date.UTC(year, month, 1, 0, 0, 0)));
    endDate = Date.parse(new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)));

    let rawQuery, groupedResults;
    rawQuery = `
    SELECT SUM(revenue) as 'Total revenue'
    FROM result
    WHERE 
      ($1 IS NULL OR result.createdAt > $1) AND 
      ($2 IS NULL OR result.createdAt < $2)
  `;

    // Execute the query
    groupedResults = await sails.sendNativeQuery(rawQuery,[startDate, endDate]);

    console.log(groupedResults.rows);

    // All done.
    return this.res.ok({
      message: `Revenue:`,
      data: groupedResults.rows,
      // count: result.length,
    });
  },
};
