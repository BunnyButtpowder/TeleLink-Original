// api/models/Agency.js

module.exports = {
    attributes: {
      name: {
        type: 'string',
        required: true
      },
      users: {
        collection: 'user', // Mối quan hệ một-nhiều với User
        via: 'agency' 
      },
    },
  };
