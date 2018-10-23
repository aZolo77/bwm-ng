const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');
const BookingCtrl = require('../controllers/booking');

router.post('', UserCtrl.authMiddlewear, BookingCtrl.createBooking);

module.exports = router;
