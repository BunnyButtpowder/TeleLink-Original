module.exports = {


    friendlyName: 'Getall',
  
  
    description: 'Getall data.',
  
  
    inputs: {
  
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs,exits) {
  
      let { res } = this
      try {
        const data = await Agency.find({
          isDelete:false
        })
        return res.ok({ data: data, count: data.length });
      } catch (err) {
        
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách dataa hoặc thông tin xác thực.' });
      }
  
  
    }
  
  
  };
  