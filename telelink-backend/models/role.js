const db = require('../db');

const getAllRoles = (callback) => {
    db.query('SELECT * FROM Roles', (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

module.exports = {
    getAllRoles
}