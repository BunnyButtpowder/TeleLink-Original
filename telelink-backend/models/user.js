const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL connected');
    }
});

const findByEmail = (email, callback) => {
    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, result) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}

const createUser = (userData, callback) => {
    const hash = bcrypt.hashSync(userData.password, 8);
    db.query(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`, [userData.email, hash, userData.role], (err, result) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

module.exports = {
    findByEmail,
    createUser,
};