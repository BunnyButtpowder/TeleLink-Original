const db = require('../db');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = (email, callback) => {
    db.query(`SELECT * FROM Users WHERE email = ?`, [email], (err, result) => {
        if (err) {
            return callback(err);
        }
        const user = result[0];
        if (!user) {
            return callback(new Error('Email not found'));
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() - 7 * 60 * 60 * 1000 + 5 * 60 * 1000);

       
        const sql = `UPDATE Users SET otp = ?, otp_expires_at = ? WHERE email = ?`;
        db.query(sql, [otp, otpExpiresAt, email], (err, result) => {
            if (err) {
                return callback(err);
            }

            
            callback(null, { otp, message: 'OTP generated and stored in DB' });
        });
    });

}
const findByUsername = (username, callback) => {
    db.query(`SELECT * FROM Users WHERE username = ?`, [username], (err, result) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}
const changePassword = (id, oldPassword, newPassword, callback) => {
    const sql = 'SELECT * FROM Users WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error retrieving user:", err);
            return callback(err);
        }
        if (results.length === 0) {
            return callback(new Error('User not found'));
        }
        const user = results[0];
        bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return callback(err);
            }
            if (!isMatch) {
                return callback(new Error('Old password is incorrect'));
            }
            const saltRounds = 10;
            bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                if (err) {
                    console.error("Error hashing new password:", err);
                    return callback(err);
                }
                const updateSql = 'UPDATE Users SET password = ? WHERE id = ?';
                db.query(updateSql, [hash, id], (err, result) => {
                    if (err) {
                        console.error("Error updating password:", err);
                        return callback(err);
                    }

                    callback(null, result);
                });
            });
        });
    });
};

const createUser = (username, email, password, role, callback) => {

    if (!username || !email || !password || !role) {
        return callback(new Error('Username, email, password, and role are required'));
    }

    const checkSql = 'SELECT * FROM Users WHERE email = ? OR username = ?';
    db.query(checkSql, [email, username], (err, results) => {
        if (err) {
            console.error("Error checking for existing user:", err);
            return callback(err);
        }

        if (results.length > 0) {
            return callback(new Error('Email or username already exists'));
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return callback(err);
            }
            const sql = 'INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(sql, [username, email, hash, role], (err, result) => {
                if (err) {
                    console.error("Error inserting user into database:", err);
                    return callback(err);
                }
                console.log("User created successfully!");
                callback(null, result);
            });
        });
    });
};

const verifyOTP = (email, otp, callback) => {
    const sql = 'SELECT * FROM Users WHERE email = ? AND otp = ?';
    db.query(sql, [email, otp], (err, result) => {
        if (err) {
            return callback(err);
        }

        const user = result[0];
        if (!user) {
            return callback(new Error('Invalid OTP or email'));
        }
        const now = new Date(Date.now() - 7 * 60 * 60 * 1000); 
        if (now > new Date(user.otp_expires_at)) {
            return callback(new Error('OTP has expired'));
        }

        callback(null, { message: 'OTP verified, you can now reset your password' });
    });
};

const updatePassword = (email, hashedPassword, callback) => {
    const sql = 'UPDATE Users SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
        if (err) {
            console.error("Error updating password:", err);
            return callback(err);
        }
        callback(null, result);
    });
};

cron.schedule('0 * * * *', () => {
    const sql = 'UPDATE Users SET otp = NULL , otp_expires_at = NULL WHERE otp_expires_at < NOW()';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa OTP hết hạn:', err);
        } else {
            console.log('Xóa OTP hết hợp:', result.affectedRows);
        }
    });
});






module.exports = {
    forgotPassword,
    findByUsername,
    createUser,
    changePassword,
    verifyOTP,
    updatePassword
};