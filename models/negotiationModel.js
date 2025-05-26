const db = require('../config/db');

const NegotiationModel = {
  create: async ({ order_id, driver_id, harga_tawaran }) => {
    const [result] = await db.execute(
      `INSERT INTO negotiations (order_id, driver_id, harga_tawaran, status, created_at, updated_at) 
       VALUES (?, ?, ?, 'waiting', NOW(), NOW())`,
      [order_id, driver_id, harga_tawaran]
    );
    return result.insertId;
  },

  findByOrderId: async (order_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM negotiations WHERE order_id = ?`,
      [order_id]
    );
    return rows;
  },

  findByDriverId: async (driver_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM negotiations WHERE driver_id = ?`,
      [driver_id]
    );
    return rows;
  },

  findAll: async () => {
    const [rows] = await db.execute(`SELECT * FROM negotiations`);
    return rows;
  },

  updateStatus: async (id, status) => {
    await db.execute(
      `UPDATE negotiations SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );
  },

  rejectOthers: async (order_id, acceptedId) => {
    await db.execute(
      `UPDATE negotiations SET status = 'rejected', updated_at = NOW() WHERE order_id = ? AND id != ?`,
      [order_id, acceptedId]
    );
  },

  delete: async (id) => {
    await db.execute(`DELETE FROM negotiations WHERE id = ?`, [id]);
  },

  findById: async (id) => {
    const [rows] = await db.execute(`SELECT * FROM negotiations WHERE id = ?`, [id]);
    return rows[0];
  }
};

module.exports = NegotiationModel;
