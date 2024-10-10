module.exports = {
  friendlyName: "Update",

  description: "Update permission.",

  inputs: {
    role_id: { type: "number", required: true },
    permissions: {
      type: "json", // Use `json` for complex data structures like an array of objects
      required: true,
      custom: function (value) {
        return (
          Array.isArray(value) &&
          value.every((permission) => {
            return (
              permission.module &&
              Array.isArray(permission.action) &&
              permission.action.every((p) => typeof p === "number")
            );
          })
        );
      },
    },
  },

  exits: {},

  fn: async function (inputs) {
    let { req, res, next } = this;
    const { role_id, permissions } = inputs;
    try {
      await Permission.destroy({ role_id });
      try {
        for (const i in permissions) {
          console.log(permissions[i]);
          
          for (const a in permissions[i].action) {
              await Permission.create({
              role_id,
              action: permissions[i].action[a],
              module: permissions[i].module,
            }).fetch();            
          }
        }
      } catch (err) {
        return res.serverError({
          error: "Xảy ra lỗi trong quá trình thêm phân quyền",
          details: err.message,
        });
      }

      return res.ok(permissions);
    } catch (err) {
      return res.serverError({
        error: "Xảy ra lỗi trong quá trình cập nhật phân quyền",
        details: err.message,
      });
    }
  },
};
