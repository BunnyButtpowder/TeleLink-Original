module.exports = {
  friendlyName: 'Getall',
  
  description: 'Get all blacklist entries for users in a specific agency.',
  
  inputs: {
    agencyID: {
      type: 'number',
      required: true,
      description: 'ID của chi nhánh (agency) để lấy danh sách đen'
    },
  },
  
  fn: async function (inputs) {
    let { res } = this;
    try {    
      const { agencyID } = inputs;

      const usersInAgency = await User.find({ agency: agencyID }).select(['id']);
      if (usersInAgency.length === 0) {
        return res.notFound({ message: "Không có người dùng nào thuộc chi nhánh này." });
      }
      // console.log(usersInAgency)

      const userIds = usersInAgency.map(user => user.id);
      console.log(userIds)

      const data = await Blacklist.find({
        user: { in: userIds }
      });

      if (data.length === 0) {
        return res.notFound({ message: "Không có dữ liệu danh sách đen cho chi nhánh này." });
      }

      return res.ok({ data: data, count: data.length });
      
    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách blacklist.' });
    }
  }
};
