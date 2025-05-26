const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role FROM users');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user', error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus user', error });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.id, o.customer_id, c.name as customer_name,
             o.driver_id, d.name as driver_name,
             o.origin, o.destination, o.price, o.status
      FROM orders o
      LEFT JOIN users c ON o.customer_id = c.id
      LEFT JOIN users d ON o.driver_id = d.id
    `);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data order', error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ message: 'Status order berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate status order', error });
  }
};

// Verifikasi driver
exports.verifyDriver = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE users SET verified = 1 WHERE id = ? AND role = "driver"', [id]);
    res.status(200).json({ message: 'Driver berhasil diverifikasi' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal verifikasi driver', error });
  }
};

// Blokir user
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE users SET blocked = 1 WHERE id = ?', [id]);
    res.status(200).json({ message: 'User berhasil diblokir' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memblokir user', error });
  }
};

// Unblokir user
exports.unblockUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE users SET blocked = 0 WHERE id = ?', [id]);
    res.status(200).json({ message: 'User berhasil di-unblokir' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuka blokir user', error });
  }
};

// Laporan order yang dibatalkan
exports.getCancelledOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.id, o.customer_id, c.name as customer_name,
             o.driver_id, d.name as driver_name,
             o.origin, o.destination, o.price, o.status
      FROM orders o
      LEFT JOIN users c ON o.customer_id = c.id
      LEFT JOIN users d ON o.driver_id = d.id
      WHERE o.status = 'cancelled'
    `);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data order yang dibatalkan', error });
  }
};
