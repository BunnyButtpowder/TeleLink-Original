const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const config = require("../config/auth.config");
const Account = require("../models/account");

async function verifyToken(req, res, next) {
    try {
        const tokenRequest = req.headers["x-access-token"];

        if (!tokenRequest) {
            throw createHttpError.BadRequest(403, "No access token provided");
        }

        // Verify the token
        jwt.verify(tokenRequest, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                const message = err instanceof jwt.TokenExpiredError ? "This token has expired" : err.message;
                throw createHttpError.Unauthorized(message);
            }
            // Update request
            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        next(error);
    }
}

module.exports = verifyToken;
