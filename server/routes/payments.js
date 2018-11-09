const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/user');
const PaymentCtrl = require('../controllers/payment');

// = login func
router.get('/', UserCtrl.authMiddlewear, PaymentCtrl.getPendingPayments);

module.exports = router;
