const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const negotiationRoutes = require('./routes/negotiationRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk akses foto profil
app.use('/uploads/profile', express.static('uploads/profile'));



// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', ordersRoutes);
app.use('/customers', customerRoutes);
app.use('/negotiations', negotiationRoutes);
app.use('/ratings', ratingRoutes);
app.use('/admin', adminRoutes);



// Error handler middleware
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
