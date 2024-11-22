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
      type: 'number',   //ket qua cuoc goi
      required: true,
      isIn: [1,2,3,4,5,6,7,8]
    },
    dataPackage:{    
      type: "string",   //id goi cuoc
      allowNull: true
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
    },
    dateToCall:{
      type: 'string',  //ngay goi lai
      required: false
    }
    

  },

  afterCreate: function (value, proceed){
    console.log(value);
    return proceed()
    
  }

};

