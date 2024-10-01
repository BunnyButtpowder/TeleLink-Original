const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/auth');
const nodemailer = require('nodemailer');

// Login
const login = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Username không tồn tại'
            });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(400).json({
                message: 'Mật khẩu không đúng'
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400,
        });
        res.status(200).json({
            message: 'Đăng nhập thành công',
            user: { id: user.id, username: user.username },
            token,
        });
    });
};

// Register
const register = (req, res) => {
    const { email, password, username, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Vui lòng cung cấp đầy đủ thông tin: email, password'
        });
    }
    User.createUser(username, email, password, role, (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            return res.status(400).json({
                message: err.message || 'Đăng ký thất bại. Vui lòng thử lại!'
            });
        }

        res.status(201).json({
            message: 'Đăng ký thành công!',
            userId: result.insertId
        });
    });
};

const changePassword = (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    User.changePassword(id, oldPassword, newPassword, (err, result) => {
        if (err) {
            console.error('Lỗi thay đổi mật khẩu:', err);
            return res.status(400).json({
                message: err.message || 'Thay đổi mật khẩu thất bại. Vui lòng thử lại!'
            });
        }
        res.status(200).json({
            message: 'Thay đổi mật khẩu thành công'
        });
    });
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "trinhphuc980@gmail.com",
        pass: "kfqbavvazdgyysmd",
    },
});

const sendOTP = async (email, OTP) => {
    const mailOptions = {
        from: 'trinhphuc980@gmail.com',
        to: email,
        subject: 'OTP xác nhận đổi mật khẩu ',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #333;">Xin chào ${email}</h2>
                OTP của bạn là : ${OTP}
            </div>
        `,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};
const sendForgotPasswordEmail = (req, res) => {
    const email = req.body.email;

    User.forgotPassword(email, (err, result) => {
        if (err) {
            return res.status(400).send(err.message);
        }

        const otp = result.otp;
        sendOTP(email, otp).then(() => {
            res.status(200).json({
                message: 'OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email để xác nhận.',
            });
        }).catch((error) => {
            res.status(400).json({
                message: 'Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại sau.',
            });
        });
    });
};

const verifyOTP = (req, res) => {
    const { email, otp, newPassword } = req.body;

  
    User.verifyOTP(email, otp, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

       
        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi trong quá trình mã hóa mật khẩu.' });
            }

           
            User.updatePassword(email, hashedPassword, (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Cập nhật mật khẩu thất bại.' });
                }

                
                res.status(200).json({ message: 'OTP đã được xác nhận và mật khẩu đã được cập nhật thành công.' });
            });
        });
    });
};



module.exports = {
    login,
    register,
    changePassword,
    sendForgotPasswordEmail,
    verifyOTP
};