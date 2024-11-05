module.exports = {
  friendlyName: "Update",

  description: "Update permission.",

  inputs: {
    role_id: { type: "number", required: true },
    permissions: {
      type: "json", // Use `json` for complex data structures like an array of objects
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    let { req, res, next } = this;
    const { role_id, permissions } = inputs;
    try {
      const result = await Role.updateOne({id: role_id}).set({permissions})
      return res.ok(result)
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi cập nhật quyền hạn.', error });
    }
  }
};
