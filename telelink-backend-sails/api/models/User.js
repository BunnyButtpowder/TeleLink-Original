/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: {type: "string", columnType: "varchar(128)", required: true},
    password: {type: "string", columnType: "varchar(128)", required: true},
    project: {type: "string", required: true, columnType: "varchar(128)"},
    payload: {type: "json", defaultsTo: {}, description: "Các thông tin gắn với nghiệp vụ"},
    additional: {type: "json", defaultsTo: {}, description: "Các thông tin thêm gắn với account "},
  },

};
