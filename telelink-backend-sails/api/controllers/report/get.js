const { fail } = require("grunt");

module.exports = {
  friendlyName: "Get revenue report by month",

  description: "A sum up of all call result in a month",

  inputs: {
    agencyId: {
      type: "string",
      required: false,
    },
    date: {
      type: "string",
      required: false,
    },
    search: {
      type: "string",
      required: false,
    },
  },

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    let { agencyId, date, search } = inputs;
    let result = [];
    let AgencyList = [];

    //định nghĩa chi nhánh cần tìm
    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      AgencyList.push(AgencyExist);
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    } else {
      if(search){
        AgencyList = await Agency.find({
          where: { name: { like: `%${search.toLowerCase()}%` } },
        });
        agencyId = undefined;
      }
      else{
        AgencyList = await Agency.find({});
      }
      
    }

    //định nghĩa tháng cần tìm
    let startDate,
      endDate = undefined;
    if (date) {
      const [month, year] = date.split("-");
      startDate = Date.parse(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
      endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));
    }

    for (const i in AgencyList) {
      let rawQuery, groupedResults;
      if (date) {
        rawQuery = `
        SELECT data_id, result, revenue
        FROM result
        WHERE agency = $1 AND createdAt > $2 AND createdAt < $3
        GROUP BY data_id, result, revenue
        `;
        groupedResults = await sails.sendNativeQuery(rawQuery, [
          AgencyList[i].id,
          startDate,
          endDate,
        ]);
      } else {
        rawQuery = `
        SELECT data_id, result, revenue
        FROM result
        WHERE agency = $1
        GROUP BY data_id, result, revenue
        `;
        groupedResults = await sails.sendNativeQuery(rawQuery, [
          AgencyList[i].id,
        ]);
      }

      const accept = groupedResults.rows.filter((x) => x.result == 1).length;
      const reject = groupedResults.rows.filter((x) => x.result == 2).length;
      const unanswered = groupedResults.rows.filter(
        (x) => x.result == 3
      ).length;
      const unreachable = groupedResults.rows.filter(
        (x) => x.result == 4
      ).length;
      const rehandle = groupedResults.rows.filter((x) =>
        [5, 6, 7].includes(x.result)
      ).length;
      const lost = groupedResults.rows.filter((x) => x.result == 8).length;

      const revenue = groupedResults.rows.reduce(
        (sum, item) => sum + item.revenue,
        0
      );

      result.push({
        agency: AgencyList[i].name,
        report: {
          total: accept + reject + unanswered + unreachable + rehandle + lost,
          accept: accept,
          reject: reject,
          unanswered: unanswered,
          unreachable: unreachable,
          rehandle: rehandle,
          lost: lost,
          revenue: revenue,
          successRate: parseFloat((accept / (accept + reject + unanswered + unreachable + rehandle + lost)) * 100).toFixed(2),
          failRate: parseFloat(((reject + unanswered + unreachable + lost) / (accept + reject + unanswered + unreachable + rehandle + lost)) * 100).toFixed(2),
        },
      });
    }
    // All done.
    return this.res.ok({
      message: `Revenue report:`,
      data: result,
      count: result.length
    });
  },
};
