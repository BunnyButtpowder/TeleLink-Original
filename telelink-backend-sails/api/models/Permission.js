/**
 * Permission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    role_id:{
      model: 'role',
      required: true
    },
    action:{
      model: 'action',
      required: true
    },
    module:{
      model: 'module',
      required: true
    },
  },

};

