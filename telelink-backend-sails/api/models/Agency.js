
/**
 * Agency.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


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
  

