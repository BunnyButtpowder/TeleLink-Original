const _ = require("lodash");

module.exports = {
  friendlyName: "Create call's result",

  description: "Allow employees to create call's result",

  inputs: {
    dataId: {
      type: "number",
      required: true,
      description: "ID of the data to be updated.",
    },
    callResult: {
      type: "json",
      required: true,
      description: "Call Result",
    },
    date: {
      type: "string",
      required: false,
      description: "Thời gian hẹn gọi lại",
    },
  },

  fn: async function (inputs) {
    let { dataId, callResult, date } = inputs;
    const userId = this.req.user.id;
    console.log('Request User:', this.req.user);
    let { result, dataPackage, customerName, address, note } = callResult;

    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        return this.res.notFound({ message: "Người dùng không hợp lệ" });
      }
      if (!user.agency) {
        return this.res.badRequest({
          message: "Người dùng chưa thuộc chi nhánh nào.",
        });
      }

      // Tìm dữ liệu theo ID
      const data = await Data.findOne({ id: dataId });

      if (!data) {
        return this.res.notFound({ message: "Dữ liệu không tìm thấy." });
      }

      // Kiểm tra xem nhân viên có quyền cập nhật dữ liệu này hay không
      const assignment = await DataRehandle.findOne({
        data: dataId,
        user: userId,
        complete: false,
      });

      if (!assignment) {
        return this.res.forbidden({
          message: "Bạn không có quyền cập nhật dữ liệu này.",
        });
      }
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

      const month = new Date(Date.now()).getMonth();
      const year = new Date(Date.now()).getFullYear();
      let startDate = Date.parse(new Date(Date.UTC(year, month, 1, 0, 0, 0)));
      let endDate = Date.parse(
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))
      );

      let report = await Report.findOne({
        agency: user.agency,
        createdAt: { ">=": startDate, "<=": endDate },
      });
      if (!report) {
        report = await Report.create({ agency: user.agency }).fetch();
      }

      switch (result) {
        case 1: //dong y
          break;
        case 2: //tu choi
          const rejection = await Result.count({
            data_id: dataId,
            result: 2,
          });
          if (rejection < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
          break;
        case 3: //khong nghe may
          const unanswered = await Result.count({
            data_id: dataId,
            result: 3,
          });
          if (unanswered < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
          break;
        case 4: //khong lien lac duoc
          const unavailable = await Result.count({
            data_id: dataId,
            result: 4,
          });
          if (unavailable < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
          break;
        case 5: //xu ly lai
        case 6:
        case 7:
          if (!date) {
            return this.res.badRequest({ message: "Thiếu ngày hẹn gọi lại!." });
          }
          const rehandle = await DataRehandle.create({
            user: userId,
            data: dataId,
            complete: false,
            latestResult: result,
            dateToCall: date,
            note: note,
          });
          break;
        case 8: //mat don
          break;
        default:
          return this.res.badRequest("Kết quả cuộc gọi không hợp lệ");
      }
      if (!date) {
        date = undefined;
      }
      const newResult = await Result.create({
        result,
        dataPackage: title,
        customerName,
        address,
        note,
        data_id: dataId,
        agency: user.agency,
        saleman: user.id,
        subscriberNumber: data.subscriberNumber,
        revenue: price,
        dateToCall: date,
      });
      await DataRehandle.updateOne({
        data: dataId,
        user: userId,
        complete: false,
      }).set({ complete: true });

      let rawQuery, groupedResults;
      rawQuery = `
        SELECT data_id, result, revenue
        FROM result
        WHERE agency = $1 AND createdAt > $2 AND createdAt < $3
        GROUP BY data_id, result, revenue
        `;
      groupedResults = await sails.sendNativeQuery(rawQuery, [
        user.agency,
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

      return this.res.ok({
        message: "Tạo kết quả cuộc gọi thành công.",
        callResult: newResult,
      });
    } catch (error) {
      console.log(error);
      return this.res.serverError({
        message: "Lỗi khi tạo kết quả cuộc gọi",
        error: error.message,
      });
    }
  },
};
