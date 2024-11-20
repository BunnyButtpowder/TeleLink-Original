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
      let {result, dataPackage, customerName, address, note, dateToCall} = update
      const existingResult = await Result.findOne({ id: resultId });
      const userId = this.req.user.id;

      const existingUser = await Auth.findOne({ id: userId });
      if (!existingUser) {
        return res.unauthorized("Người dùng đăng nhập không tồn tại");
      }
      if(existingUser.role != 1 && userId != existingResult.saleman){
        return this.res.forbidden({ message: "Không được phép sửa kết quả cuộc gọi này!" })
      }

      if (!existingResult) {
        return this.res.notFound({ message: "Dữ liệu không tìm thấy." });
      }

      //kiểm tra thời gian tạo và thời gian update
      const currentMonth = new Date(Date.now()).getMonth();
      const createdMonth = new Date(existingResult.createdAt).getMonth();
      console.log(currentMonth, createdMonth);

      let package = null;
      if (dataPackage) {
        package = await Package.findOne({ id: dataPackage });
        if (!package) {
          return this.res.notFound({ message: "Không tìm thấy gói data." });
        }
        if (result != 1) {
          package.price = 0;
        }
        dataPackage = package.title;
      }

      if (currentMonth == createdMonth) {
        await Result.updateOne(
          { id: resultId },
          { result, dataPackage, customerName, address, note, dateToCall, revenue: package.price }
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
