module.exports = {


  friendlyName: 'Test permission',


  description: 'Do absolute nothing',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    let { res, req } = this;
    
    
    return res.ok({message: "You are allowed to proceed"});

  }


};
