module.exports = function SocketEventsHook(sails) {
    return {
      initialize: async function (cb) {
        sails.on('hook:sockets:loaded', () => {
          sails.io.on('connection', (socket) => {
            console.log(`New client connected: ${socket.id}`);
  
            socket.on('joinRoom', ({ agencyId }) => {
              if (agencyId) {
                socket.join(agencyId);
                console.log(`Socket ${socket.id} joined room: ${agencyId}`);
              } else {
                console.log('joinRoom called without agencyId');
              }
            });
  
            socket.on('disconnect', () => {
              console.log(`Client disconnected: ${socket.id}`);
            });
          });
        });
        
        cb();
      },
     
    };
  };
  