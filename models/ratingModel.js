const pool = require('../config/db');

exports.createRating = async (order_id, customer_id, driver_id, nilai_rating, komentar, callback) => {
  console.log("MASUK MODEL");

  try {
    const [result] = await pool.execute(
      `INSERT INTO ratings (order_id, customer_id, driver_id, nilai_rating, komentar)
       VALUES (?, ?, ?, ?, ?)`,
      [order_id, customer_id, driver_id, nilai_rating, komentar]
    );
    console.log("HASIL QUERY:", result);
    callback(null, result);
  } catch (err) {
    console.error("ERROR QUERY:", err);
    callback(err);
  }
};

exports.getAllRatings = async (callback) => {
  try {
    const [results] = await pool.execute(`SELECT * FROM ratings`);
    callback(null, results);
  } catch (err) {
    callback(err);
  }
};

exports.getRatingByOrderId = async (order_id, callback) => {
  try {
    const [results] = await pool.execute(`SELECT * FROM ratings WHERE order_id = ?`, [order_id]);
    callback(null, results[0]);
  } catch (err) {
    callback(err);
  }
};

exports.updateRating = async (order_id, data, callback) => {
  const { nilai_rating, komentar } = data;
  try {
    const [result] = await pool.execute(
      `UPDATE ratings SET nilai_rating = ?, komentar = ? WHERE order_id = ?`,
      [nilai_rating, komentar, order_id]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

exports.deleteRating = async (order_id, callback) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM ratings WHERE order_id = ?`,
      [order_id]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
