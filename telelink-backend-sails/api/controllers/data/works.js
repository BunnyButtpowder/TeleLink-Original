const _ = require("lodash");

module.exports = {
  friendlyName: "Update assigned data",

  description: "Allow employees to update their assigned data",

  inputs: {
    dataId: {
      type: "number",
      required: true,
      description: "ID of the data to be updated.",
    },
    userId: {
      type: "number",
      required: true,
      description: "ID of the employee updating the data.",
    },
    callResult: {
      type: "json",
      required: true,
      description: "Call Result",
    },
  },

  fn: async function (inputs) {
    const { dataId, userId, callResult } = inputs;

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
      });

      if (!assignment) {
        return this.res.forbidden({
          message: "Bạn không có quyền cập nhật dữ liệu này.",
        });
      }

      const package = await Package.findOne({ id: callResult.dataPackage });
      if (!package) {
        return this.res.notFound({ message: "Không tìm thấy gói data." });
      }
      console.log(data.subscriberNumber);

      const newResult = await Result.create({
        data_id: dataId,
        agency: user.agency,
        saleman: user.id,
        subscriberNumber: data.subscriberNumber,
        revenue: package.price,
        ...callResult,
      });

      if (callResult.result != "Xử Lý Lại") {
        if (callResult.result == "Không Bắt Máy") {
          const rejection = await Result.count({
            data_id: dataId,
            result: "Không Bắt Máy",
          });
          if (rejection < 3) {
            await Data.updateOne({ id: dataId }).set({ isDelete: false });
          }
        }
        await DataAssignment.updateOne({
          data: dataId,
          user: userId,
        }).set({complete: true});
      } else {
        const rehandle = await Result.count({
          data_id: dataId,
          result: "Xử Lý Lại"
        });
        if(rehandle > 2){
          await Data.updateOne({ id: dataId }).set({ isDelete: false });
          await DataAssignment.updateOne({
            data: dataId,
            user: userId,
          }).set({complete: true});
        }
      }

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
