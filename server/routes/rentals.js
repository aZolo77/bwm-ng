const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
// token middlewear
const UserCtrl = require('../controllers/user');
const { normalizeErrors } = require('../helpers/mongoose');

// = managing rentals (find all rentals created by this User)
router.get('/manage', UserCtrl.authMiddlewear, (req, res) => {
  const user = res.locals.user;

  Rental.where({ user })
    .populate('bookings')
    .exec((err, foundRentals) => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json(foundRentals);
    });
});

router.get('/:id/verify-user', UserCtrl.authMiddlewear, function(req, res) {
  const rentalId = req.params.id;
  const user = res.locals.user;

  Rental.findById(rentalId)
    .populate('user')
    .exec(function(err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            {
              title: 'Invalid User',
              detail: 'You are not this rental owner'
            }
          ]
        });
      }

      return res.json({ status: 'verified' });
    });
});

// = find rental by its ID
router.get('/:id', (req, res) => {
  const rentalId = req.params.id;

  // добавить в ответ user/bookings
  Rental.findById(rentalId)
    .populate('user', 'username -_id')
    .populate('bookings', 'startAt endAt -_id')
    .exec((err, foundRental) => {
      if (err) {
        return res.status(422).send({
          errors: [{ title: 'Rental Error', detail: 'Could not find Rental!' }]
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
              detail: `There are no rentals for city ${city}`
            }
          ]
        });
      }
      return res.json(foundRental);
    });
});

// = creating a new Rental
router.post('', UserCtrl.authMiddlewear, (req, res) => {
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

// = partial updating of certain Rental
router.patch('/:id', UserCtrl.authMiddlewear, (req, res) => {
  // get Rental Data from user-request
  const rentalData = req.body;
  const user = res.locals.user;

  Rental.findById(req.params.id)
    .populate('user')
    .exec(function(err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            {
              title: 'Invalid User',
              detail: 'You are not this rental owner'
            }
          ]
        });
      }

      // updating existing rental
      foundRental.set(rentalData);
      foundRental.save(function(err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        return res.status(200).send(foundRental);
      });
    });
});

// = delete Rental
router.delete('/:id', UserCtrl.authMiddlewear, (req, res) => {
  const user = res.locals.user;
  Rental.findById(req.params.id)
    .populate('user', '_id')
    .populate({
      path: 'bookings',
      select: 'startAt',
      match: { startAt: { $gt: new Date() } }
    })
    .exec((err, foundRental) => {
      if (err) {
        res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      // if this is not this Rental owner
      if (user.id !== foundRental.user.id) {
        return res.status(422).send({
          errors: [
            {
              title: 'Invalid User',
              detail: `You are not this Rental owner!`
            }
          ]
        });
      }

      // if there are still active bookings on this Rental
      if (foundRental.bookings.length > 0) {
        return res.status(422).send({
          errors: [
            {
              title: 'Active Bookings',
              detail: `Cannot delete Rental with active Bookings!`
            }
          ]
        });
      }

      foundRental.remove(err => {
        if (err) {
          res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.status(200).json({ status: 'deleted' });
      });
    });
});

module.exports = router;
