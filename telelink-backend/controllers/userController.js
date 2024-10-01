const User = require('../models/user');

const getAllUsers = (req, res) => {
    User.getAllUsers((err, result) => {
        if (err) {
            return res.status(400).json({
                message: err
            });
        }
        return res.status(200).json({
            message: 'Danh sách thành viên',
            users: result
        });
    });
}

module.exports = {
    getAllUsers  
}