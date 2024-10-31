const bcrypt = require('bcrypt');

module.exports = {
    inputs: {
        fullName: { type: 'string', required: true },
        phoneNumber: { type: 'string', required: true },
        dob: { type: 'string' },
        address: { type: 'string', required: true },
        email: { type: 'string', required: true },
        username: { type: 'string', required: true },
        password: { type: 'string', required: true },
        role: { type: 'number', required: true }, // Giả sử role = 3 là nhân viên
        gender: { type: 'string', required: true },
        agencyId: { type: 'number', required: true }, 
    },

    fn: async function (inputs) {
        let { req, res } = this;
        try {
            const { fullName, phoneNumber, dob, address, email, username, password, role, gender, agencyId } = inputs;

            if (role !== 3) {
              return res.badRequest({ message: "Role của nhân viên mới phải là 3." });
          }

           
            const existingAgency = await Agency.findOne({ id: agencyId });
            if (!existingAgency) {
                return res.notFound({ message: "Chi nhánh không tồn tại." });
            }


            const existingEmail = await Auth.findOne({ email });
            if (existingEmail) {
                return res.conflict({ message: "Email đã tồn tại" });
            }


            const existingUsername = await Auth.findOne({ username });
            if (existingUsername) {
                return res.conflict({ message: "Username đã tồn tại" });
            }


            const hashedPassword = await bcrypt.hash(password, 10);

            const newAuth = await Auth.create({
                email,
                username,
                password: hashedPassword,
                role,
                isActive: true
            }).fetch();

            const newUser = await User.create({
                fullName,
                phoneNumber,
                dob,
                address,
                gender,
                auth: newAuth.id,
                agency: agencyId // Liên kết với chi nhánh
            }).fetch();

            return res.status(201).json({ message: "Đăng ký nhân viên thành công", newUser });
        } catch (err) {
            sails.log.error('Error creating user or auth info:', err);
            return res.serverError({ error: 'Có lỗi xảy ra khi tạo nhân viên.' });
        }
    },
};
