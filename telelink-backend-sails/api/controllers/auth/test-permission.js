module.exports = {


  friendlyName: 'Test permission',


  description: 'Do absolute nothing',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    let { res, req } = this;
    const authorized = await sails.helpers.checkPermission.with({role_id:req.role,action:"test",module:"permission"})
    console.log(authorized);
    
    if(!authorized){
      return res.unauthorized({message: "Không có quyền truy cập"})
    }
    
    return res.json({message: "You are allowed to proceed"});

  }


};
