const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Reset Password',

  description: 'Verify OTP and reset password.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
    },
    otpCode: {
      type: 'string',
      required: true,
    },
    newPassword: {
      type: 'string',
      required: true,
      minLength: 6,
    },
  },

 

  fn: async function (inputs) {
    let { res, req } = this;
    const user = await Auth.findOne({ email: inputs.email });

    if (!user || user.otpCode !== inputs.otpCode ) {
      return res.forbidden({ message: "OTP code is invalid" });
    }

    if ( user.otpExpiresAt < new Date()) {
      return res.forbidden({ message: "OTP code has expired" });
    }

     const hashedPassword = await bcrypt.hash(inputs.newPassword, 10); 


    await Auth.updateOne({ id: user.id }).set({
      password: hashedPassword,
      otpCode: null,
      otpExpiresAt: null,
    });

    return { message: 'Password has been reset successfully.' };
  },
};
