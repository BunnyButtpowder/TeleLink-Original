module.exports = {
    attributes: {
      user: { 
        model: 'user', 
        required: true 
      }, 
      filePath: { 
        type: 'string', 
        required: true 
      }, 
      scheduledDate: { 
        type: 'ref', 
        columnType: 'datetime', 
        required: true 
      }, 
      isProcessed: { 
        type: 'boolean', 
        defaultsTo: false 
      },
    },
  };
  