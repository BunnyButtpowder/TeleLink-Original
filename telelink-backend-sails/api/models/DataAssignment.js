// api/models/DataAssignment.js
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
    complete: {
      type: 'boolean',
      defaultsTo: false,
    },
    assignedAt: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: new Date(),  
    }
  }
};
