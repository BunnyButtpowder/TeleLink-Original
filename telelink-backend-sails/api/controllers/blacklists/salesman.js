module.exports = {

  friendlyName: 'Getall',

  description: 'Get all blacklist entries for a specific user.',

  inputs: {
    userID: {
      type: 'number',
      required: true,
      description: 'ID của người dùng để lấy danh sách đen'
    },
  },

  fn: async function (inputs) {
    let { res } = this;
    try {    
      const { userID } = inputs;
      const data = await Blacklist.find({
        user: userID
       
      });
      if (data.length === 0) {
        return res.notFound({ message: "Không có dữ liệu." });
      }

      return res.json({ data: data, count: data.length });
      
    } catch (err) {
      sails.log.error('Error fetching blacklist data:', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách blacklist.' });
    }
  }

};
