module.exports = {
  friendlyName: "Check user permission",

  description: "Check if user have the permission to call the targeted api",

  inputs: {
    role_id: {
      type: "number",
      required: true,
      description: "user role",
    },
    action: {
      type: "string",
      required: true,
      description: "action",
    },
    module: {
      type: "string",
      required: true,
      description: "module",
    },
  },

  exits: {
    success: {
      description: "User is allowed to procceed",
    },
    forbidden: {
      description: "User is not allowed to procceed",
    },
  },

  fn: async function (inputs) {
    try {
      let { res, req, next } = this;
      const { role_id, action, module } = inputs;

      const action_id = await Action.findOne({ action });
      const module_id = await Module.findOne({ module });
      if (!action_id || !module_id) {
        return res.unauthorized({ message: "Permission not exists" });
      }

      const permission = await Permission.findOne({
        role_id: existingUser.role,
        action: action_id.id,
        module: module_id.id,
      });
      if (!permission) {
        return res.unauthorized({ message: "Không có quyền truy cập" });
      }
      next();
    } catch (err) {
      return res.unauthorized({ message: "Không có quyền truy cập" });
    }
  },
};
