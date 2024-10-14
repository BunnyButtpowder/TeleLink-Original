module.exports = {


  friendlyName: 'Test permission',


  description: 'Do absolute nothing',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    let { res, req } = this;
    await sails.helpers.checkPermission(role_id=req.role,action="test",module="permission")
    if(req.param("action") != "test" || req.param("module") != "permission"){
      return res.unauthorized({message: "Không có quyền truy cập"})
    }
    
    return res.json({message: "You are allowed to proceed"});

  }


};
