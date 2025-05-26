const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
require('dotenv').config();

// Buat server HTTP dari Express app
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Ganti dengan URL frontend (misalnya Flutter Web atau React Admin Panel)
    methods: ['GET', 'POST']
  }
});

// Panggil handler WebSocket
const socketHandler = require('./sockets');
socketHandler(io);

// Jalankan server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
