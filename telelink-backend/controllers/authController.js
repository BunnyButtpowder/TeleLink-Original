const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Login
const login = (req, res) => {
    const {email, password} = req.body;
    User.findByEmail(email, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid) {
            return res.status(400).json({
                message: 'Wrong password'
            });
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });

        // login successfully
        res.status(200).json({
            user: {id: user.id, email: user.email, role: user.role},
            token,
        });
    });
};

// Register
const register = (req, res) => {
    const {email, password, role} = req.body;
    User.createUser({email, password, role}, (err, result) => {
        if(err) {
            return res.status(400).json({
                message: 'Register failed'
            });
        }
        res.status(201).json({
            message: 'Register successfully'
        });
    });
}

module.exports = {
    login,
    register,
};