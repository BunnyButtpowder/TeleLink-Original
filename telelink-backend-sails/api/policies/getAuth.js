module.exports = async function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {
        err: {status: "danger", message: "auth.policy.wrongFormat"},
      });
    }
  } else if (req.param("token")) {
    token = req.param("token");
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {
      err: {
        status: "danger",
        message: "auth.policy.noAuthorizationHeaderFound",
      },
    });
  }

  jwt.verifyAsync(token).then((decodedToken) => {
    req.user = decodedToken;
    next();
  }).catch((err) => {
    return res.json(401, {
      err: {status: "danger", message: "auth.policy.invalidToken", detail: err,},
    });
  });
};
