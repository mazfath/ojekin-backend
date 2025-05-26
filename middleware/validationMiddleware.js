function validateCreateRating(req, res, next) {
  const { order_id, customer_id, driver_id, nilai_rating } = req.body;
  if (!order_id || !customer_id || !driver_id || nilai_rating === undefined) {
    return res.status(400).json({ success: false, message: 'Field wajib diisi: order_id, customer_id, driver_id, nilai_rating' });
  }
  if (typeof nilai_rating !== 'number' || nilai_rating < 1 || nilai_rating > 5) {
    return res.status(400).json({ success: false, message: 'Nilai rating harus angka antara 1-5' });
  }
  next();
}

function validateUpdateRating(req, res, next) {
  const { nilai_rating } = req.body;
  if (nilai_rating !== undefined) {
    if (typeof nilai_rating !== 'number' || nilai_rating < 1 || nilai_rating > 5) {
      return res.status(400).json({ success: false, message: 'Nilai rating harus angka antara 1-5' });
    }
  }
  next();
}

module.exports = {
  validateCreateRating,
  validateUpdateRating,
};
