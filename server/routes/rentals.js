const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
// token middlewear
const UserCtrl = require('../controllers/user');
const { normalizeErrors } = require('../helpers/mongoose');

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

// = find all rentals or some rentals filtered by city-name
router.get('', (req, res) => {
  const city = req.query.city;

  const query = city ? { city: city.toLowerCase() } : {};

  // get rentals without bookings
  Rental.find(query)
    .select('-bookings')
    .exec((err, foundRental) => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (city && foundRental.length === 0) {
        return res.status(422).send({
          errors: [
            {
              title: 'No Rentals Found',
              delail: `There are no rentals for city ${city}`
            }
          ]
        });
      }
      return res.json(foundRental);
    });
});

// creating a new Rental
router.post('', UserCtrl.authMiddlewear, (req, res) => {
  //
  const user = res.locals.user;
  const {
    title,
    city,
    street,
    category,
    image,
    bedrooms,
    shared,
    description,
    dailyRate,
    createdAt
  } = req.body;

  const rental = new Rental({
    title,
    city,
    street,
    category,
    image,
    bedrooms,
    shared,
    description,
    dailyRate,
    createdAt,
    user
  });

  Rental.create(rental, (err, newRental) => {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    User.update(
      { _id: user.id },
      { $push: { rentals: newRental } },
      function() {
        if (err) {
          res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
      }
    );

    return res.json(newRental);
  });
});

module.exports = router;
