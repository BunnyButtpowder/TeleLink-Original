const { fail } = require("grunt");

module.exports = {
  friendlyName: "Total revenue",

  description: "Total revenue",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    let { res } = this;
    //định nghĩa tháng cần tìm
    let userId = this.req.user.id;
    console.log(userId);
    let startDate,
      endDate = undefined;
    const user = await User.findOne({ id: userId }).populate("auth");

    if (!user) {
      return this.res.notFound({ message: "Người dùng không hợp lệ" });
    }
    if(user.auth.role !== 2) {
      return this.res.forbidden({ message: "Chỉ có quyền truy cập của admin chi nhánh." });
    }
    if (!user.agency) {
      return this.res.badRequest({
        message: "Người dùng chưa thuộc chi nhánh nào.",
      });
    }
    
    

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
      ($2 IS NULL OR result.createdAt < $2) AND
      result.agency = $3
  `;

    // Execute the query
    groupedResults = await sails.sendNativeQuery(rawQuery, [
      startDate,
      endDate,
      user.agency,
    ]);

    console.log(groupedResults.rows);

    // All done.
    return this.res.ok({
      message: `Revenue:`,
      data: groupedResults.rows,
      // count: result.length,
    });
  },
};
