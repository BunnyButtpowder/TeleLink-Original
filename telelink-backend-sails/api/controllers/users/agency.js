module.exports = {
    inputs: {
        agencyId: { type: 'number', required: true },
    },

    fn: async function (inputs) {
        let { req, res } = this;
        try {
            const { agencyId } = inputs;


            const existingAgency = await Agency.findOne({ id: agencyId });
            if (!existingAgency) {
                return res.notFound({ message: "Chi nhánh không tồn tại." });
            }
            const employees = await User.find({
                agency: agencyId
            }).populate('auth');
            const staffMembers = employees
                .filter(user => user.auth && user.auth.role === 3)
                .map(user => ({
                    id: user.id,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    dob: user.dob,
                    avatar: user.avatar,
                    gender: user.gender,
                    createdAt: user.createdAt,
                    auth: {
                        email: user.auth.email,
                        role: user.auth.role,
                        username: user.auth.username
                    },
                }));

            return res.ok({ employees: staffMembers });
      } catch (err) {
          
          return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách nhân viên.',err });
      }
  },
};
