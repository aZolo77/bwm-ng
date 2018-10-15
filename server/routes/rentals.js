const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');

// = find all rentals
router.get('', (req, res) => {
  Rental.find({}, (err, foundRentals) => {
    res.json(foundRentals);
  });
});

// = find rental by its ID
router.get('/:id', (req, res) => {
  const rentalId = req.params.id;
  Rental.findById(rentalId, (err, foundRental) => {
    if (err) {
      res
        .status(422)
        .send({
          errors: [{ title: 'Rental Error', delail: 'Could not find Rental!' }]
        });
    }
    res.json(foundRental);
  });
});

module.exports = router;
