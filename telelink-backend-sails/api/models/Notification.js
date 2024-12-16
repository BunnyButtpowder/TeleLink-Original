module.exports = {
  globalId: 'Notifications',
  attributes: {
    user: {
      model: 'user',
      required: true,
    },
    message: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'string',
      isIn: ['read', 'unread'],
      defaultsTo: 'unread',
    },
  },
};
