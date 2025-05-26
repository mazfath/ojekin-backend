const db = require('../config/db');

const Customer = {
  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT 
        c.user_id,
        u.name,
        u.email,
        u.phone,
        c.alamat_default,
        c.lat_default,
        c.lng_default,
        c.metode_pembayaran_default,
        c.created_at,
        c.updated_at
      FROM customers c
      JOIN users u ON c.user_id = u.id`
    );
    return rows;
  },

  getById: async (userId) => {
    const [rows] = await db.execute(
      `SELECT 
        c.user_id,
        u.name,
        u.email,
        u.phone,
        c.alamat_default,
        c.lat_default,
        c.lng_default,
        c.metode_pembayaran_default,
        c.created_at,
        c.updated_at
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  create: async (data) => {
    const { user_id, alamat_default, lat_default, lng_default, metode_pembayaran_default } = data;
    await db.execute(
      `INSERT INTO customers
        (user_id, alamat_default, lat_default, lng_default, metode_pembayaran_default, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [user_id, alamat_default, lat_default, lng_default, metode_pembayaran_default]
    );
  },

  update: async (userId, data) => {
    data = data || {};
    const fields = [];
    const values = [];

    if (data.alamat_default !== undefined) {
      fields.push('alamat_default = ?');
      values.push(data.alamat_default);
    }
    if (data.lat_default !== undefined) {
      fields.push('lat_default = ?');
      values.push(data.lat_default);
    }
    if (data.lng_default !== undefined) {
      fields.push('lng_default = ?');
      values.push(data.lng_default);
    }
    if (data.metode_pembayaran_default !== undefined) {
      fields.push('metode_pembayaran_default = ?');
      values.push(data.metode_pembayaran_default);
    }

    if (fields.length === 0) return 0;

    fields.push('updated_at = NOW()');
    values.push(userId);

    const sql = `UPDATE customers SET ${fields.join(', ')} WHERE user_id = ?`;
    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  delete: async (userId) => {
    const [result] = await db.execute(
      'DELETE FROM customers WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows;
  }
};

module.exports = Customer;
