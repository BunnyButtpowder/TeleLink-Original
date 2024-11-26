module.exports = {

    friendlyName: 'Get Package by ID',
  
    description: 'Lấy thông tin Package dựa trên ID.',
  
    inputs: {
      id: {
        type: 'number',
        required: true,
      }
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
        return res.ok({
          id: data.id,
          package: data.Package,
          message: `Lấy thông tin Package thành công.`,
        });
  
      } catch (err) {
        console.error(err);
        return res.serverError({
          error: 'Có lỗi xảy ra khi lấy thông tin Package.',
        });
      }
    }
  };
  