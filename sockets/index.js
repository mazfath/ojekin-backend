// Untuk menyimpan mapping userId ↔️ socket.id
const userSockets = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // ==== 1. REGISTER userSocket ====
    socket.on('registerUser', ({ userId }) => {
      userSockets.set(userId, socket.id);
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
    });

    // ==== 2. DRIVER LOCATION TRACKING ====
    socket.on('driverLocationUpdate', ({ driverId, lat, lng }) => {
      console.log(`📍 Driver ${driverId} location:`, lat, lng);
      // Broadcast ke customer terkait jika perlu
      io.emit('driverLocationUpdated', { driverId, lat, lng });
    });

    // ==== 3. REALTIME CHAT ====
    socket.on('sendMessage', ({ fromUserId, toUserId, message }) => {
      const toSocketId = userSockets.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('receiveMessage', {
          fromUserId,
          message,
          timestamp: new Date()
        });
      } else {
        console.log(`⚠️ User ${toUserId} not connected`);
      }
    });

    // ==== 4. ORDER CREATED ====
    socket.on('createOrder', (orderData) => {
      console.log('🛵 Order created:', orderData);
      // Broadcast ke semua driver
      socket.broadcast.emit('newOrder', orderData);
    });

    // ==== 5. DRIVER NEGOSIASI HARGA ====
    socket.on('proposePrice', ({ toUserId, price, orderId }) => {
      const toSocketId = userSockets.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('priceProposal', { price, orderId });
      }
    });

    // ==== 6. CUSTOMER RESPON HARGA ====
    socket.on('respondToPrice', ({ toUserId, accepted, orderId }) => {
      const toSocketId = userSockets.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('priceResponse', { accepted, orderId });
      }
    });

    // ==== 7. DRIVER MENERIMA ORDER ====
    socket.on('acceptOrder', ({ driverId, customerId, orderId }) => {
      const customerSocketId = userSockets.get(customerId);
      if (customerSocketId) {
        io.to(customerSocketId).emit('orderAccepted', {
          driverId,
          orderId
        });
      }
    });

    // ==== 8. ORDER STATUS UPDATE ====
    socket.on('updateOrderStatus', ({ orderId, status }) => {
      io.emit('orderStatusUpdated', { orderId, status });
    });

    // ==== DISCONNECT ====
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
      // Hapus dari map jika perlu
      for (let [userId, id] of userSockets.entries()) {
        if (id === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
};
