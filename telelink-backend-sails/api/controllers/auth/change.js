const bcrypt = require('bcrypt');

module.exports = {

    inputs: {
        oldPassword: { type: "string", required: true },
        newPassword: { type: "string", required: true },
        id: { type: "number", required: true }
    },

    exits: {},

    fn: async function (inputs) {
        let { res, req } = this;

        try {
            
            const { oldPassword, newPassword , id } = inputs;
            const auth = await Auth.findOne({ id });
            if (!auth) {
                return res.badRequest({ message: "Không tìm thấy tài khoản." });
            }
            const isMatch = await bcrypt.compare(oldPassword, auth.password);
            if (!isMatch) {
                return res.badRequest({ message: "Mật khẩu cũ không đúng" });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await Auth.updateOne({ id: auth.id }).set({ password: hashedNewPassword });

            return res.json({ message: "Mật khẩu đã được thay đổi thành công." });

        } catch (err) {
            return res.serverError({ error: "Đã xảy ra lỗi trong quá trình đổi mật khẩu", details: err.message });
        }
    }
};
