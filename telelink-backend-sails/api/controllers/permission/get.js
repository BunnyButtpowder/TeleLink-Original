module.exports = {


  friendlyName: 'Get',


  description: 'Get permission.',


  inputs: {
    role_id: { type: "number", required: true }
  },


  exits: {

  },


  fn: async function (inputs) {
    let { req, res, next } = this;
    const { role_id } = inputs;
    const role = await Role.findOne({id: role_id})
    const result = await Permission.find({id: {in : role.permissions}})
    return res.ok(result);

  }


};
