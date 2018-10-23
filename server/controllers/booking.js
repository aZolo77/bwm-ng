const moment = require('moment');
const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

exports.createBooking = function(req, res) {
  // = geting booking data from Client request (form)
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  // = get user from locals created in User Model
  const user = res.locals.user;

  // creating booking localy
  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

  // geting rental by id (also from request)
  Rental.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec(function(err, foundRental) {
      if (err) {
        res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      // если это booking, созданный самим заказчиком
      if (foundRental.user.id === user.id) {
        return res.status(422).send({
          errors: [
            {
              title: 'Invalid User',
              detail: 'Cannot create booking on your own rental!'
            }
          ]
        });
      }

      // checking booking dates
      if (isValidBooking(booking, foundRental)) {
        booking.user = user;
        booking.rental = foundRental;

        // updating rentals/users and saving a booking
        foundRental.bookings.push(booking);
        booking.save(function(err) {
          if (err) {
            res.status(422).send({ errors: normalizeErrors(err.errors) });
          }
          foundRental.save();
          User.update(
            { _id: user.id },
            { $push: { bookings: booking } },
            function(err) {
              if (err) {
                res.status(422).send({ errors: normalizeErrors(err.errors) });
              }
            }
          );
          // return dates
          return res.json({ startAt: booking.startAt, endAt: booking.endAt });
        });
      } else {
        return res.status(422).send({
          errors: [
            {
              title: 'Invalid Booking',
              detail: 'Choosen dates are already taken!'
            }
          ]
        });
      }
    });
};

// validating booking
function isValidBooking(proposedBooking, rental) {
  //
  let isValid = true;

  if (rental.bookings && rental.bookings.length > 0) {
    // itterate bookings with few conditions
    isValid = rental.bookings.every(function(booking) {
      const proposedStart = moment(proposedBooking.startAt);
      const proposedEnd = moment(proposedBooking.endAt);

      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.startAt);

      return (
        (actualStart < proposedStart && actualEnd < proposedStart) ||
        (proposedEnd < actualEnd && proposedEnd < actualStart)
      );
    });
  }

  return isValid;
}
