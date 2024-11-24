// api/models/Auth.js


module.exports = {
  attributes: {
    email: { type: 'string', unique: true },
    username: { type: 'string', unique: true },
    password: { type: 'string' },
    role: {
      model: 'Role', 
      required: true  
    },
    isActive: { type: 'boolean', defaultsTo: true },
    otpCode: { type: 'string', allowNull: true },
    otpExpiresAt: { type: 'ref', columnType: 'datetime' },
  }
};

