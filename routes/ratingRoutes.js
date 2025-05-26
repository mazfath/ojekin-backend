const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.createRating);
router.get('/', ratingController.getAllRatings);
router.get('/:order_id', ratingController.getRatingByOrderId);
router.put('/:order_id', ratingController.updateRating);
router.delete('/:order_id', ratingController.deleteRating);

module.exports = router;
