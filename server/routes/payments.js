const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');
const PaymentCtrl = require('../controllers/payment');

// = login func
router.get('', UserCtrl.authMiddlewear, PaymentCtrl.getPendingPayments);

// = accept payment
router.post('/accept', UserCtrl.authMiddlewear, PaymentCtrl.confirmPayment);

// = decline payment
router.post('/decline', UserCtrl.authMiddlewear, PaymentCtrl.declinePayment);

module.exports = router;
