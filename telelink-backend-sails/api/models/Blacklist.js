/**
 * Blacklist.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      SDT: {
        type: 'string',
        required: true
      },
      note:{
        type: 'string',
        allowNull: true,
      },
      user: {
        model: 'user',
  
      },

    },
  
  };
  
  