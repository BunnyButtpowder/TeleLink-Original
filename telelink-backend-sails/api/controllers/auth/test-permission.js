module.exports = {


  friendlyName: 'Test permission',


  description: 'Do absolute nothing',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    let { res, req } = this;
    
    if(false){
      return res.unauthorized({message: "Không có quyền truy cập"})
    }
    
    return res.json({message: "You are allowed to proceed"});

  }


};
