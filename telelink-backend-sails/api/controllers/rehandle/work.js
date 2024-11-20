const _ = require("lodash");

module.exports = {
  friendlyName: "Create call's result",

  description: "Allow employees to create call's result of rehandle data",

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
    let { result, dataPackage, customerName, address, note } = callResult;

    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        return this.res.notFound({ message: "Người dùng không hợp lệ" });
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
      let package = null;
      if (callResult.dataPackage) {
        package = await Package.findOne({ id: callResult.dataPackage });
        callResult.dataPackage = package.title;
        if (!package) {
          return this.res.notFound({ message: "Không tìm thấy gói data." });
        }
      }

      const month = new Date(Date.now()).getMonth();
      const year = new Date(Date.now()).getYear();
      let startDate = Date.parse(
        new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
      );
      let endDate = Date.parse(new Date(Date.UTC(year, month, 0, 23, 59, 59)));

      let report = await Report.findOne({
        agency: user.agency,
        createdAt: { ">=": startDate, "<=": endDate },
      });
      if (!report) {
        report = await Report.create({ agency: user.agency });
      }

      switch (result) {
        case 1: //dong y
          await Report.updateOne({ id: report.id }).set({
            accept: report.accept + 1,
            revenue: report.revenue + package.price,
            total: report.total + 1,
          });
          break;
        case 2: //tu choi
          const rejection = await Result.count({
            data_id: dataId,
            result: 2,
          });
          if (rejection < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          } else {
            await Report.updateOne({ id: report.id }).set({
              reject: report.reject + 1,
              total: report.total + 1,
            });
          }
          break;
        case 3: //khong nghe may
          const unanswered = await Result.count({
            data_id: dataId,
            result: 3,
          });
          if (unanswered < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          } else {
            await Report.updateOne({ id: report.id }).set({
              unanswered: report.unanswered + 1,
              total: report.total + 1,
            });
          }
          break;
        case 4: //khong lien lac duoc
          const unavailable = await Result.count({
            data_id: dataId,
            result: 4,
          });
          if (unavailable < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          } else {
            await Report.updateOne({ id: report.id }).set({
              unavailable: report.unavailable + 1,
              total: report.total + 1,
            });
          }
          break;
        case 5: //xu ly lai
        case 6:
        case 7:
          if (!date) {
            return this.res.badRequest({ message: "Thiếu ngày hẹn gọi lại!." });
          }
          const exist = await Result.find({
            data_id: dataId,
            result: [5, 6, 7],
          });
          const rehandle = await DataRehandle.create({
            user: userId,
            data: dataId,
            complete: false,
            latestResult: result,
            dateToCall: date,
            note: note,
          });
          if (!exist) {
            await Report.updateOne({ id: report.id }).set({
              rehandle: report.rehandle + 1,
              total: report.total + 1,
            });
          }

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
        data_id: dataId,
        agency: user.agency,
        saleman: user.id,
        subscriberNumber: data.subscriberNumber,
        revenue: package.price,
        dateToCall: date,
        result,
        dataPackage,
        customerName,
        address,
        note,
      });
      await DataRehandle.updateOne({
        data: dataId,
        user: userId,
      }).set({ complete: true });

      return this.res.ok({
        message: "Tạo kết quả cuộc gọi thành công.",
        callResult: newResult,
      });
    } catch (error) {
      return this.res.serverError({
        message: "Lỗi khi tạo kết quả cuộc gọi",
        error: error.message,
      });
    }
  },
};
