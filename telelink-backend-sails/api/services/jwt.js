// const secret = "DCMA3281emndscfjldsjs2";
const jwt = require("jsonwebtoken");
const services = {};
services.sign = function (data) {
  return jwt.sign(data, secret, { expiresIn: "365d" });
};

services.verifyAsync = function (token) {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return rej(err);
      return res(decoded);
    });
  });
};
services.verify = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};
module.exports = services;
