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

  fn: async function (inputs, exits) {
    try {
      const { role_id, action, module } = inputs;

      const action_id = await Action.findOne({ title:action });
      const module_id = await Module.findOne({ title:module });
      
      if (!action_id || !module_id) {
        return exits.success(false)
      }

      const permission = await Permission.findOne({
        role_id: role_id,
        action: action_id.id,
        module: module_id.id,
      });
      
      if (!permission) {
        return exits.success(false)
      }
      return exits.success(true)
    } catch (err) {
      return exits.success(false)
    }
  },
};
