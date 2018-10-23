const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
// token middlewear
const UserCtrl = require('../controllers/user');

// = find all rentals
router.get('', UserCtrl.authMiddlewear, (req, res) => {
  // get rentals without bookings
  Rental.find({})
    .select('-bookings')
    .exec((err, foundRental) => {
      res.json(foundRental);
    });
});

// = find rental by its ID
router.get('/:id', UserCtrl.authMiddlewear, (req, res) => {
  const rentalId = req.params.id;

  // добавить в ответ user/bookings
  Rental.findById(rentalId)
    .populate('user', 'username -_id')
    .populate('bookings', 'startAt endAt -_id')
    .exec((err, foundRental) => {
      if (err) {
        return res.status(422).send({
          errors: [{ title: 'Rental Error', delail: 'Could not find Rental!' }]
        });
      }
      return res.json(foundRental);
    });
});

module.exports = router;
