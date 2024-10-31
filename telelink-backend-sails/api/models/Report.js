/**
 * Report.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    agency: {
      model: "agency",
      unique: true
    },
    total: {
      type: "number",  //tổng đơn hàng
      defaultsTo: 0
    },
    accept: {
      type: "number",  //đồng ý
      defaultsTo: 0
    },
    reject: {
      type: "number",  //không đồng ý
      defaultsTo: 0
    },
    unanswered: {
      type: "number",  //không nghe máy
      defaultsTo: 0
    },
    unavailable: {
      type: "number",  //không liên lạc được
      defaultsTo: 0
    },
    rehandle: {
      type: "number",  //không liên lạc được
      defaultsTo: 0
    }
  },

};

