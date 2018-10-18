const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

// = login func
router.post('/auth', User.auth);

// = registration func
router.post('/register', User.register);

module.exports = router;
