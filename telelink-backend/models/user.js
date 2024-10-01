const db = require('../db');

const getAllUsers = (callback) => {
    db.query('SELECT Users.id, Users.username, Users.email , Users.address, Users.telephone,Users.gender, Users.fullname, Users.avatar,Roles.title AS role FROM Users LEFT JOIN Roles ON Users.role = Roles.id', (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

module.exports = {
    getAllUsers
}