const { fail } = require("grunt");

module.exports = {
  friendlyName: "Total revenue",

  description: "Total revenue",

  inputs: {

  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;

    let rawQuery, groupedResults;
    rawQuery = `
    SELECT SUM(revenue) as 'Total revenue', agency.name as agency
    FROM result
    LEFT JOIN agency ON result.agency = agency.id
    GROUP BY agency.name
  `;

    // Execute the query
    groupedResults = await sails.sendNativeQuery(rawQuery);

    console.log(groupedResults.rows);

    // All done.
    return this.res.ok({
      message: `Revenue:`,
      data: groupedResults.rows,
      // count: result.length,
    });
  },
};
