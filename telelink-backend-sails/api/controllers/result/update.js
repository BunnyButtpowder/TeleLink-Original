
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
      const result = await Result.findOne({ id: resultId });

      if (!result) {
        return this.res.notFound({ message: "Dữ liệu không tìm thấy." });
      }

      //kiểm tra thời gian tạo và thời gian update
      const currentMonth = new Date(Date.now()).getMonth()
      const createdMonth = new Date(result.createdAt).getMonth()
      console.log(currentMonth, createdMonth);

      if(currentMonth == createdMonth){
        await Result.updateOne({id: resultId},{...update})
      }
      else{
        return this.res.forbidden("This Result is not allowed to be changed!")
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
