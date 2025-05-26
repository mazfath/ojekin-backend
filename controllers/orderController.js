const db = require('../config/db');

// Get all orders
exports.getOrders = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Get order by id
exports.getOrderById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    const { customer_id, driver_id, lokasi_jemput, lokasi_antar, jarak_km, harga, status } = req.body;
    const [result] = await db.query(
      `INSERT INTO orders 
      (customer_id, driver_id, lokasi_jemput, lokasi_antar, jarak_km, harga, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, driver_id, lokasi_jemput, lokasi_antar, jarak_km, harga, status || 'pending']
    );
    res.status(201).json({ id: result.insertId, message: 'Order created' });
  } catch (error) {
    next(error);
  }
};

// Update order by id
exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { customer_id, driver_id, lokasi_jemput, lokasi_antar, jarak_km, harga, status, waktu_selesai } = req.body;

    const [result] = await db.query(
      `UPDATE orders SET 
        customer_id = ?, 
        driver_id = ?, 
        lokasi_jemput = ?, 
        lokasi_antar = ?, 
        jarak_km = ?, 
        harga = ?, 
        status = ?,
        waktu_selesai = ?
      WHERE id = ?`,
      [customer_id, driver_id, lokasi_jemput, lokasi_antar, jarak_km, harga, status, waktu_selesai, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated' });
  } catch (error) {
    next(error);
  }
};

// Delete order by id
exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Update status jadi accepted jika status saat ini pending
    const [result] = await db.execute(
      `UPDATE orders SET status = 'accepted' WHERE id = ? AND status = 'pending'`,
      [orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Order tidak bisa diterima atau tidak ditemukan' });
    }

    res.json({ message: 'Order berhasil diterima' });
  } catch (error) {
    next(error);
  }
};

exports.completeOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const waktuSelesai = new Date();

    // Update status jadi completed dan set waktu_selesai jika statusnya accepted atau on_the_way
    const [result] = await db.execute(
      `UPDATE orders SET status = 'completed', waktu_selesai = ? WHERE id = ? AND status IN ('accepted', 'on_the_way')`,
      [waktuSelesai, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Order tidak bisa diselesaikan atau tidak ditemukan' });
    }

    res.json({ message: 'Order berhasil diselesaikan' });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Update status jadi cancelled jika status belum completed atau cancelled
    const [result] = await db.execute(
      `UPDATE orders SET status = 'cancelled' WHERE id = ? AND status NOT IN ('completed', 'cancelled')`,
      [orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Order tidak bisa dibatalkan atau tidak ditemukan' });
    }

    res.json({ message: 'Order berhasil dibatalkan' });
  } catch (error) {
    next(error);
  }
};
