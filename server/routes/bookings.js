const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');
const BookingCtrl = require('../controllers/booking');

// = creating new booking
router.post('', UserCtrl.authMiddlewear, BookingCtrl.createBooking);
// = managing bookings of this User
router.get('/manage', UserCtrl.authMiddlewear, BookingCtrl.getUserBookings);

module.exports = router;
