/**
 * Role.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const { required } = require("include-all");

module.exports = {
  attributes: {
    title: { 
      type: 'string', 
      required: true, 
      unique: true 
    },
    onlyViewCreateBy: {
      type: 'boolean',
      required: true,
    },
    permissions: {
      type: 'json',
      defaultsTo: [],
    }
  }

};
