var arrQuery = require("array-query");

module.exports = async function (req, res, next) {
  let user;
  if (req.user) {
    user = req.user;
    const existingUser = await Auth.findOne({ id: user.id });
    if (!existingUser) {
      return res.unauthorized("Người dùng đăng nhập không tồn tại");
    }

    let { query, params, options, method } = req;

    let api = await Permission.findOne({ path: options.action, method: method });

    let role = await Role.findOne({ id: existingUser.role });
    console.log(api, role);
    

    if (api) {
      if (!role || !role.permissions.includes(api.id)) {
        return res.forbidden({
          message: sails.__("403"),
          error: "PERMISSION_DENIED",
        });
      }
      next();
    } else {
      return res.notFound({
        message: sails.__("404"),
        error: sails.__("API not found!"),
      });
    }
  } else return res.unauthorized({ message: "Không có quyền truy cập" });
};
