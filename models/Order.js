const dbPool = require('../config/db'); // mysql2 pool connection

// Create order
const createOrder = async ({ id_user, origin, destination, price }) => {
  const sql = `INSERT INTO orders (id_user, origin, destination, price, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())`;
  const [result] = await dbPool.execute(sql, [id_user, origin, destination, price]);
  return { id: result.insertId, id_user, origin, destination, price, status: 'pending' };
};

// Get all orders
const getOrders = async () => {
  const [rows] = await dbPool.execute(`SELECT * FROM orders`);
  return rows;
};

// Get order by id
const getOrderById = async (id) => {
  const [rows] = await dbPool.execute(`SELECT * FROM orders WHERE id = ?`, [id]);
  return rows[0];
};

// Update order
const updateOrder = async (id, data) => {
  // Contoh update fleksibel: bikin query dinamis sesuai data
  let fields = [];
  let values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  values.push(id);

  const sql = `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
  const [result] = await dbPool.execute(sql, values);
  return result.affectedRows > 0;
};

// Delete order
const deleteOrder = async (id) => {
  const [result] = await dbPool.execute(`DELETE FROM orders WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
