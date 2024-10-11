module.exports = {


  friendlyName: 'Verify token',


  description: 'Verifies a JWT token and returns the decoded user details.',


  inputs: {},


  exits: {
    success: {
      description: 'Token is valid.',
    },
    invalidToken: {
      statusCode: 401,
      description: 'The token provided is invalid or expired.',
    },
    missingAuthHeader: {
      statusCode: 400,
      description: 'Authorization header is missing or malformed.',
    }
  },


  fn: async function (inputs, exits) {
    if(!this.req.headers.authorization) {
      return exits.missingAuthHeader({ message: 'Authorization header is missing.' });
    }

    const token = this.req.headers.authorization.split(' ')[1];

    if(!token) {
      return exits.missingAuthHeader({ message: 'Authorization header is malformed.' });
    }

    try {
      const decodedToken = await sails.helpers.jwt.verifyAsync(token);
      return exits.success({ message: 'Token is valid.', user: decodedToken });
    } catch (err) {
      return exits.invalidToken({ message: 'The token provided is invalid or expired.', detail: err });
    }
  }
};
