module.exports = {


  friendlyName: 'Getall',


  description: 'Getall data.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let { res } = this
    try {
      const data = await Data.find({
        isDelete:false
      })
      return res.json({ data: data, count: data.length });
    } catch (err) {
      sails.log.error('Error fetching users or auth info:', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách dataa hoặc thông tin xác thực.' });
    }


  }


};
