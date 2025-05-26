const ratingModel = require('../models/ratingModel');

exports.createRating = (req, res) => {
  const { order_id, customer_id, driver_id, nilai_rating, komentar } = req.body;

  console.log("MASUK CONTROLLER");

  ratingModel.createRating(order_id, customer_id, driver_id, nilai_rating, komentar, (err, result) => {
    console.log("SELESAI QUERY");

    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal menambahkan rating' });
    }

    res.status(201).json({ message: 'Rating berhasil ditambahkan', data: result });
  });
};

exports.getAllRatings = (req, res) => {
  ratingModel.getAllRatings((err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
};

exports.getRatingByOrderId = (req, res) => {
  const order_id = req.params.order_id;
  ratingModel.getRatingByOrderId(order_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!result) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.json(result);
  });
};

exports.updateRating = (req, res) => {
  const order_id = req.params.order_id;
  const data = req.body;
  ratingModel.updateRating(order_id, data, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.json({ success: true, message: 'Rating updated', data });
  });
};

exports.deleteRating = (req, res) => {
  const order_id = req.params.order_id;
  ratingModel.deleteRating(order_id, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.json({ success: true, message: 'Rating deleted' });
  });
};
