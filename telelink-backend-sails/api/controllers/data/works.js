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
      const assignment = await DataAssignment.findOne({
        data: dataId,
        user: userId,
        complete: false
      });

      if (!assignment) {
        return this.res.forbidden({
          message: "Bạn không có quyền cập nhật dữ liệu này.",
        });
      }
      let package = null
      if (callResult.dataPackage) {
        package = await Package.findOne({ id: callResult.dataPackage });
        callResult.dataPackage = package.title
        if (!package) {
          return this.res.notFound({ message: "Không tìm thấy gói data." });
        }
      }
      


      switch (callResult.result) {
        case 1: //dong y
          break;
        case 2: //tu choi
          callResult.dataPackage = null;
          package.price = 0;
          const rejection = await Result.count({
            data_id: dataId,
            result: 2,
          });
          if (rejection < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
          break;
        case 3: //khong nghe may
          package.price = 0;
          callResult.dataPackage = null;
          const unanswered = await Result.count({
            data_id: dataId,
            result: 3,
          });
          if (unanswered < 2) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
          break;
        case 4: //khong lien lac duoc
          package.price = 0;
          callResult.dataPackage = null;
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
          if(!date){
            return this.res.badRequest({message:"Thiếu ngày hẹn gọi lại!."})
          }
          package.price = 0;
          callResult.dataPackage = null;
          const rehandle = await DataRehandle.create({
            user: userId,
            data: user.agency,
            complete: false,
            latestResult: callResult.result,
            dateToCall: date,
            note: callResult.note
          });
          break;
        case 8:   //mat don
          package.price = 0;
          callResult.dataPackage = null;
          break;
        default:
          return this.res.badRequest("Kết quả cuộc gọi không hợp lệ");
      }
      if(!date){
        date = undefined
      }
      const newResult = await Result.create({
        data_id: dataId,
        agency: user.agency,
        saleman: user.id,
        subscriberNumber: data.subscriberNumber,
        revenue: package.price,
        dateToCall: date,
        ...callResult,
      });
      await DataAssignment.updateOne({
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
