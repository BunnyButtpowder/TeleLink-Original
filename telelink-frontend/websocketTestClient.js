import io from 'socket.io-client';

const agencyId = '1'

// Kết nối đến server WebSocket
const socket = io('http://localhost:9999', {
  transports: ['websocket']
});  

socket.on('connect', function() {
  console.log('WebSocket client connected!');
  console.log('Joining room:', agencyId);
  socket.emit('joinRoom', { agencyId });
});

socket.on('newDataAssigned', function(data) {
  console.log('Received newDataAssigned event:', data);
  // Bạn có thể xử lý dữ liệu ở đây, ví dụ hiển thị thông báo cho người dùng.
});

socket.on('disconnect', function() {
  console.log('WebSocket client disconnected');
});

socket.on('connect_error', function(error) {
  console.log('Connection error:', error);
});
