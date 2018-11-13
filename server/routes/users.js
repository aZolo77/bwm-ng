const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

// = get User info
router.get('/:id', User.authMiddlewear, User.getUser);

// = login func
router.post('/auth', User.auth);

// = registration func
router.post('/register', User.register);

module.exports = router;
