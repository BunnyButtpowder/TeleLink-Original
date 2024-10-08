/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');

module.exports = {
    changePassword: async function (req, res) {
        const { id } = req.params; 
        const { oldPassword, newPassword } = req.body;

        console.log(id)
    
        try {
            
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
    
        } catch (error) {
            console.error('Error in changePassword:', error);
            return res.serverError(error);
        }
    }
};

