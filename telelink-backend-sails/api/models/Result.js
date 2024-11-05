/**
 * Result.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    data_id:{
      model: 'Data',
      required: true
    },
    agency:{
      model: 'Agency',
    },
    saleman:{
      model: 'User'
    },
    subscriberNumber:{
      type: 'string',
      required: true
    },
    result:{
      type: 'string',   //ket qua cuoc goi
      required: true,
      isIn: ["Đồng Ý","Không Đồng Ý","Không Bắt Máy","Không Liên Lạc Được","Xử Lý Lại"]
    },
    dataPackage:{    
      model: 'Package'   //id goi cuoc
    },
    customerName:{
      type: 'string',
    },
    address:{
      type: 'string',
    },
    note:{
      type: 'string',    //ghi chu
    },
    revenue:{
      type: 'number'   //doanh thu
    }
    

  },

};

