// controllers/negotiationController.js

const db = require('../config/db'); // sesuaikan dengan koneksi DB-mu

// Buat negosiasi baru
const createNegotiation = async (req, res) => {
  try {
    const { order_id, driver_id, harga_tawaran } = req.body;

    if (!order_id || !driver_id || !harga_tawaran) {
      return res.status(400).json({ message: 'Data kurang lengkap' });
    }

    const [result] = await db.execute(
      `INSERT INTO negotiations (order_id, driver_id, harga_tawaran, status) VALUES (?, ?, ?, 'waiting')`,
      [order_id, driver_id, harga_tawaran]
    );

    return res.status(201).json({
      message: 'Negosiasi berhasil dibuat',
      negotiation: {
        id: result.insertId,
        order_id,
        driver_id,
        harga_tawaran,
        status: 'waiting'
      }
    });
  } catch (error) {
    console.error('Error createNegotiation:', error);
    return res.status(500).json({ message: 'Gagal membuat negosiasi', error: error.message });
  }
};

// Ambil semua negosiasi berdasarkan order_id
const getByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const [rows] = await db.execute(
      `SELECT * FROM negotiations WHERE order_id = ? ORDER BY created_at DESC`,
      [orderId]
    );

    return res.json({ negotiations: rows });
  } catch (error) {
    console.error('Error getByOrderId:', error);
    return res.status(500).json({ message: 'Gagal mengambil negosiasi berdasarkan order', error: error.message });
  }
};

// Ambil semua negosiasi (bisa ditambah filter jika perlu)
const getAllNegotiations = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM negotiations ORDER BY created_at DESC`);
    return res.json({ negotiations: rows });
  } catch (error) {
    console.error('Error getAllNegotiations:', error);
    return res.status(500).json({ message: 'Gagal mengambil data negosiasi', error: error.message });
  }
};

// Ambil negosiasi by ID
const getNegotiationById = async (req, res) => {
  try {
    const negotiationId = req.params.id;
    const [rows] = await db.execute(`SELECT * FROM negotiations WHERE id = ?`, [negotiationId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Negosiasi tidak ditemukan' });
    }

    return res.json({ negotiation: rows[0] });
  } catch (error) {
    console.error('Error getNegotiationById:', error);
    return res.status(500).json({ message: 'Gagal mengambil negosiasi', error: error.message });
  }
};

// Terima tawaran negosiasi
const acceptNegotiation = async (req, res) => {
  try {
    const negotiationId = req.params.id;

    if (!negotiationId) {
      return res.status(400).json({ message: "ID tawaran diperlukan" });
    }

    // Pastikan negosiasi ada
    const [rows] = await db.execute(`SELECT * FROM negotiations WHERE id = ?`, [negotiationId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tawaran negosiasi tidak ditemukan" });
    }

    // Update status jadi accepted
    const [result] = await db.execute(`UPDATE negotiations SET status = 'accepted' WHERE id = ?`, [negotiationId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Gagal menerima tawaran" });
    }

    return res.json({ message: "Tawaran diterima", negotiation: { id: negotiationId, status: 'accepted' } });
  } catch (error) {
    console.error("Error acceptNegotiation:", error);
    return res.status(500).json({ message: "Gagal menerima tawaran", error: error.message });
  }
};

// Tolak tawaran negosiasi
const rejectNegotiation = async (req, res) => {
  try {
    const negotiationId = req.params.id;

    if (!negotiationId) {
      return res.status(400).json({ message: "ID tawaran diperlukan" });
    }

    // Pastikan negosiasi ada
    const [rows] = await db.execute(`SELECT * FROM negotiations WHERE id = ?`, [negotiationId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tawaran negosiasi tidak ditemukan" });
    }

    // Update status jadi rejected
    const [result] = await db.execute(`UPDATE negotiations SET status = 'rejected' WHERE id = ?`, [negotiationId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Gagal menolak tawaran" });
    }

    return res.json({ message: "Tawaran ditolak", negotiation: { id: negotiationId, status: 'rejected' } });
  } catch (error) {
    console.error("Error rejectNegotiation:", error);
    return res.status(500).json({ message: "Gagal menolak tawaran", error: error.message });
  }
};

const getByDriverId = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    const [rows] = await db.execute(
      `SELECT * FROM negotiations WHERE driver_id = ? ORDER BY created_at DESC`,
      [driverId]
    );

    return res.json({ negotiations: rows });
  } catch (error) {
    console.error('Error getByDriverId:', error);
    return res.status(500).json({ message: 'Gagal mengambil negosiasi berdasarkan driver', error: error.message });
  }
};

module.exports = {
  createNegotiation,
  getAllNegotiations,
  getNegotiationById,
  acceptNegotiation,
  rejectNegotiation,
  getByOrderId, 
  getByDriverId,
};
