const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get top saleman of the month or all-time",

  description: "Top best selling salemans",

  inputs: {
    number: {
      type: "number",
      required: true,
    },
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
    let { number, agencyId, date } = inputs;

    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    } else {
      agencyId = undefined;
    }

    const criteria = {
      agency: agencyId,
    };

    //định nghĩa tháng cần tìm
    let startDate,
      endDate = undefined;
    if (date) {
      const [month, year] = date.split("-");
      startDate = Date.parse(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
      endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));
      criteria.createdAt = { ">=": startDate, "<=": endDate }; 
    }

    let rawQuery, groupedResults;
    rawQuery = `
    SELECT SUM(revenue) as 'Total revenue', saleman, user.fullname, user.avatar, agency.name as agency
    FROM result
    JOIN user ON saleman = user.id
    LEFT JOIN agency ON user.agency = agency.id
    WHERE 
      ($1 IS NULL OR result.agency = $1) AND 
      ($2 IS NULL OR result.createdAt > $2) AND 
      ($3 IS NULL OR result.createdAt < $3)
    GROUP BY saleman, agency.name
    ORDER BY SUM(revenue) DESC
    LIMIT $4
  `;

    // Execute the query
    groupedResults = await sails.sendNativeQuery(rawQuery, [
      agencyId || null,
      startDate || null,
      endDate || null,
      number
    ]);

    console.log(groupedResults.rows);

    // All done.
    return this.res.ok({
      message: `Top 10 saleman of the company in ${date}:`,
      data: groupedResults.rows,
      // count: result.length,
    });
  },
};
