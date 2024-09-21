const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Login
const login = (req, res) => {
    const {username, password} = req.body;
    User.findByEmail(username, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                message: 'Username không tồn tại'
            });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid) {
            return res.status(400).json({
                message: 'Mật khẩu không đúng'
            });
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: 86400,
        });        
        res.status(200).json({
            user: {id: user.id, username: user.username},
            token,
        });
    });
};

// Register
const register = (req, res) => {
    const { email, password , username , role } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Vui lòng cung cấp đầy đủ thông tin: email, password'
        });
    }
    User.createUser(username, email, password,role, (err, result) => {
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
    const {id} = req.params;
    const {oldPassword, newPassword} = req.body;
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


module.exports = {
    login,
    register,
    changePassword
};