const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Verify JWT Token',

  description: 'Helper to verify JWT asynchronously.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The JWT token to verify.',
    },
  },

  exits: {
    success: {
      description: 'Token verified successfully.',
    },
    invalidToken: {
      description: 'The provided token is invalid or expired.',
    },
  },

  fn: async function ({ token }, exits) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      return exits.success(decoded);
    } catch (err) {
      return exits.invalidToken(err);
    }
  },
};
