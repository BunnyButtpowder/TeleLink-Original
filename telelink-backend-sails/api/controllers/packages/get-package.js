module.exports = {
  friendlyName: "Get Package by ID",

  description: "Lấy thông tin Package dựa trên ID.",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  fn: async function (inputs) {
    let { res } = this;

    try {
      const { id } = inputs;
      const data = await Data.findOne({ id: id });

      if (!data) {
        return res.notFound({
          message: `Không tìm thấy dữ liệu với ID ${id}.`,
        });
      }

      let dataResult = data.currentPackage.split(",");
      dataResult = dataResult.concat(data.Package.split(","));
      console.log(dataResult);

      for (i in dataResult) {
        dataResult[i] = dataResult[i].toUpperCase().trim();
      }

      const result = await Package.find({ title: { in: dataResult } });

      if (result.length > 0)
        return res.ok({
          id: data.id,
          package: result,
          message: `Lấy thông tin Package thành công.`,
        });
      else
        return res.notFound({message: "Không có package tương ứng trong cơ sở dữ liệu"})
    } catch (err) {
      console.error(err);
      return res.serverError({
        error: "Có lỗi xảy ra khi lấy thông tin Package.",
      });
    }
  },
};
