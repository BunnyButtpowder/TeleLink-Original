/**
 * Permission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title:{
      type:"string",
      required: true,
      unique: true
    },
    path:{
      type:"string",
      required: true,
    },
    method:{
      type:"string",
      required: true,
    },
  },

};

