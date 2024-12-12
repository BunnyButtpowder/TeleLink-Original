// api/models/DataRehandle.js
module.exports = {
  attributes: {
    user: {
      model: 'user',
      required: true,
    },
    data: {
      model: 'data',
      required: true,
    },
    subcriberNumber: {
      type: 'string',
      allowNull:true
    },
    customerName: {
      type: 'string',
      allowNull:true
    },
    complete: {
      type: 'boolean',
      defaultsTo: false,
    },
    latestResult:{
      type: 'number',
      required: true
    },
    dateToCall: {
      type: 'string',
      required: true
    },
    note: {
      type: 'string',
      allowNull:true
    } 
  }
};
