module.exports = {


    friendlyName: 'GetallPackages',
  
  
    description: 'Getall packages',
  
  
    inputs: {
  
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs,exits) {
  
      let { res } = this
      try {
        const data = await Package.find({
          isDelete:false
        })
        return res.ok({ data: data, count: data.length });
      } catch (err) {
        
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách dataa hoặc thông tin xác thực.' });
      }
  
  
    }
  
  
  };
  