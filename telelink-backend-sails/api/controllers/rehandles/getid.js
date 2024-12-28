module.exports = {
    friendlyName: "Get By ID",
  
    description: "Get rehandle by ID.",
  
    inputs: {
      id: {
        type: "number",
        required: true,
        
      },
    },
    fn: async function (inputs) {
      const { id } = inputs;
      let { res } = this;
      try {

        const rehandle = await DataRehandle.findOne({ id }).populate("data");
  
        if (!rehandle) {
          return res.notFound({
            message: `Không tìm thấy dữ liệu với ID: ${id}`,
          });
        }
  
        return res.ok({
          message: "Dữ liệu rehandle tìm thấy",
          data: rehandle,
        });
      } catch (error) {
        console.error("Error while fetching rehandle by ID:", error);
        return res.serverError({
          message: "Đã xảy ra lỗi khi lấy dữ liệu.",
          error: error.message,
        });
      }
    },
  };
  