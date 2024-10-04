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
    // Khóa ngoại tham chiếu đến bảng Auth
    auth: {
      model: 'auth',
      unique: true
    },
    
  },
};
