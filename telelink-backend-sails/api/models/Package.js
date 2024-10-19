/**
 * Package.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    code: {
      type: 'string',
      unique: true
    },
    title: {
      type: 'string',
      unique: true
    },
    provider: {
      type: 'string',
    },
    type: {
      type: 'string'
    },
    price: {
      type: 'number'
    }

  },

};

