const Roles = require('../models/role');

const getAllRoles = (req, res) => {
    Roles.getAllRoles((err , result) => {
        if (err) {
            return res.status(400).json({
                message: err
            });
        }
        return res.status(200).json({result}
        );
    });
}

module.exports = {
    getAllRoles
}