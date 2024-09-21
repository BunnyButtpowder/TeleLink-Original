const db = require('../db');
const bcrypt = require('bcryptjs');


const findByEmail = (username, callback) => {
    db.query(`SELECT * FROM users WHERE username = ?`, [username], (err, result) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}
const changePassword = (id, oldPassword, newPassword, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    
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
                const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
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

    const checkSql = 'SELECT * FROM users WHERE email = ? OR username = ?';
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
            const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
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



module.exports = {
    findByEmail,
    createUser,
    changePassword
};