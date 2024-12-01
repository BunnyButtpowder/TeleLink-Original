module.exports = async function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    } else {
      return res.status(401).json({ err: 'Wrong token format' });
    }
  } else {
    return res.status(401).json({ err: 'Authorization header missing' });
  }

  try {
    const decodedToken = await sails.helpers.jwt.verifyAsync(token);
    req.user = decodedToken; // Attach the user data to req object
    const existingUser = await Auth.findOne({ id: decodedToken.id });
    if (!existingUser) {
      return res.unauthorized("Người dùng đăng nhập không tồn tại");
    }
    return next();
  } catch (err) {
    return res.status(401).json({ err: 'Invalid token', details: err });
  }
};
