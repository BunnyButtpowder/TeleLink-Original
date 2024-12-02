module.exports = {
  friendlyName: "Update call result",

  description: "Allow admin to edit the call's reulst",

  inputs: {
    resultId: {
      type: "number",
      required: true,
      description: "ID of the result",
    },
    update: {
      type: "json",
      required: true,
      description: "updated field",
    },
  },

  fn: async function (inputs) {
    let { resultId, update } = inputs;
    try {
      // Tìm dữ liệu theo ID
      let { result, dataPackage, customerName, address, note, dateToCall } =
        update;
      const existingResult = await Result.findOne({ id: resultId });
     

      const userId = this.req.user.id;
      

      const existingUser = await User.findOne({ auth: userId });
      if (!existingUser) {
        return res.unauthorized("Người dùng đăng nhập không tồn tại");
      }
      if (existingUser.role != 1 && userId != existingResult.saleman) {
        return this.res.forbidden({
          message: "Không được phép sửa kết quả cuộc gọi này!",
        });
      }

      if (!existingResult) {
        return this.res.notFound({ message: "Dữ liệu không tìm thấy." });
      }

      //kiểm tra thời gian tạo và thời gian update
      const currentMonth = new Date(Date.now()).getMonth();
      const createdMonth = new Date(existingResult.createdAt).getMonth();
      const currentYear = new Date(Date.now()).getYear();
      const createdYear = new Date(existingResult.createdAt).getYear();

      let title = null;
      let price = 0
      if (dataPackage && result == 1) {
        const package = await Package.findOne({ id: dataPackage });
        if (!package) {
          return this.res.notFound({ message: "Không tìm thấy gói data." });
        }
        title = package.title
        price = package.price
      }

      if (currentMonth == createdMonth && createdYear == currentYear) {
        const month = new Date(Date.now()).getMonth();
        const year = new Date(Date.now()).getFullYear();
        let startDate = Date.parse(new Date(Date.UTC(year, month, 1, 0, 0, 0)));
        let endDate = Date.parse(
          new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))
        );

        let report = await Report.findOne({
          agency: existingUser.agency,
          createdAt: { ">=": startDate, "<=": endDate },
        });
        if (!report) {
          report = await Report.create({ agency: existingUser.agency }).fetch();
        }
        await Result.updateOne(
          { id: resultId },
          {
            result,
            dataPackage: title,
            customerName,
            address,
            note,
            dateToCall,
            revenue: price,
          }
        );
        let rawQuery, groupedResults;
        rawQuery = `
        SELECT data_id, result, revenue
        FROM result
        WHERE agency = $1 AND createdAt > $2 AND createdAt < $3
        GROUP BY data_id, result, revenue
        `;
        groupedResults = await sails.sendNativeQuery(rawQuery, [
          existingUser.agency,
          startDate,
          endDate,
        ]);
        const accept = groupedResults.rows.filter((x) => x.result == 1).length;
        const reject = groupedResults.rows.filter((x) => x.result == 2).length;
        const unanswered = groupedResults.rows.filter(
          (x) => x.result == 3
        ).length;
        const unavailable = groupedResults.rows.filter(
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

        await Report.updateOne(
          { id: report.id },
          {
            total: accept + reject + unanswered + unavailable + rehandle + lost,
            accept,
            reject,
            unanswered,
            unavailable,
            rehandle,
            lost,
            revenue,
            successRate:
              accept + reject + unanswered + unavailable + rehandle + lost > 0
                ? Math.round(
                    (accept /
                      (accept +
                        reject +
                        unanswered +
                        unavailable +
                        rehandle +
                        lost)) *
                      100 *
                      100
                  ) / 100
                : 0,
            failRate:
              accept + reject + unanswered + unavailable + rehandle + lost > 0
                ? Math.round(
                    ((reject + unanswered + unavailable + lost) /
                      (accept +
                        reject +
                        unanswered +
                        unavailable +
                        rehandle +
                        lost)) *
                      100 *
                      100
                  ) / 100
                : 0,
          }
        );
      } else {
        return this.res.forbidden("This Result is not allowed to be changed!");
      }
      return this.res.ok({
        message: "Cập nhật kết quả cuộc gọi thành công.",
      });
    } catch (error) {
      return this.res.serverError({
        message: "Lỗi khi tạo kết quả cuộc gọi",
        error: error.message,
      });
    }
  },
};
