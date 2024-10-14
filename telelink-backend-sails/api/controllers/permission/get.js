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
    const result = await Permission.findOne({role_id}).populate("action").populate("module")
    return res.ok(result);

  }


};
