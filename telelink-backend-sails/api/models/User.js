// api/models/User.js

module.exports = {
  attributes: {
    fullName: {
      type: 'string',
      required: true
    },
    phoneNumber: {
      type: 'string',
      allowNull: true
    },
    address: {
      type: 'string',
      allowNull: true
    },
    dob: {
      type: 'string',
      allowNull: true
    },
    agency: {
      type: 'number'
    },
    avatar: {
      type: 'string',
    },
    gender: {
      type: 'string',
      isIn: ['male', 'female', 'other']
    },
    dataType: {
      type: 'string',
    },
    auth: {
      model: 'auth',
      unique: true
    },

  },
};
