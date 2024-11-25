module.exports = {

  friendlyName: 'Send OTP',

  description: 'Send OTP to user email for password reset.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      
    },
  },

  fn: async function (inputs) {
    try {
      
      const user = await Auth.findOne({ email: inputs.email });
      if (!user) {
        return { success: false, message: 'Email không tồn tại.' };
      }

      
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); 

    
      await Auth.updateOne({ id: user.id }).set({
        otpCode: otpCode,
        otpExpiresAt: expiry,
      });

      
      await sails.helpers.sendEmail.with({
        to: inputs.email,
        subject: 'Mã OTP đặt lại mật khẩu',
        text: `Chào ${user.username},\n\nMã OTP của bạn là: ${otpCode}\nMã OTP sẽ hết hạn sau 5 phút.\n\n`,
      });

      return { success: true, message: 'Mã OTP đã được gửi qua email.' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' };
    }
  }

};
