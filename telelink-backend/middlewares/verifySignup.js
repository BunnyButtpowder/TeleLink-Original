const createHttpError = require("http-errors");
const Account = require("../models/account");

async function CheckExsistUser(req, res, next) {
    try {
        if (!req.body.username || !req.body.password) {
            throw createHttpError.BadRequest("Username or password is required")
        }
        if (await Account.findOne({ username: req.body.username })) {
            throw createHttpError.BadRequest("Username is Unique")
        }
        next();
    } catch (error) {
        next(error)
    }
}
const VerifySignup = {
    CheckExsistUser
}
module.exports= VerifySignup