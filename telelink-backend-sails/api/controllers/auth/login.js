const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

    inputs: {
        username: { type: "string", required: true },
        password: { type: "string", required: true },

    },

    exits: {
    },
    fn: async function (inputs) {
        let { res, req } = this;

        try {


            const { username, password } = inputs;
            
            if (!username.trim() || !password.trim()) {
                return res.badRequest({ message: "Username và password không được để trống" });
            }

            const auth = await Auth.findOne({ username });
            if (!auth) {
                return res.notFound({ message: "Username không tồn tại" });
            }
            const isMatch = await bcrypt.compare(password, auth.password);
            if (!isMatch) {
                return res.forbidden({ message: "Mật khẩu không đúng" });
            }
            if (!auth.isActive) {
                return res.forbidden({ message: "Tài khoản chưa được kích hoạt" });
            }
            const user = await User.findOne({ auth: auth.id });
            if (!user) {
                return res.badRequest({ message: "Không tìm thấy người dùng liên quan" });
            }
            const token = jwt.sign({ id: auth.id, username: auth.username , role : auth.role ,agency : user.agency}, process.env.JWT_SECRET, { expiresIn: '365d' });

           
            return res.json({ message: "Đăng nhập thành công", user: { id: user.id, fullname: user.fullName, agencyId: user.agency }, token });


        } catch (err) {
            return res.serverError({ error: "Đã xảy ra lỗi trong quá trình đăng nhập", details: err.message });
        }
    }
}