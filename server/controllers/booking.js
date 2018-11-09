const moment = require('moment');
const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const Payment = require('../models/payment');
const { normalizeErrors } = require('../helpers/mongoose');
const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);

const CUSTOMER_SHARE = 0.8;

// = creating new Booking
exports.createBooking = function(req, res) {
  // = geting booking data from Client request (form)
  const {
    startAt,
    endAt,
    totalPrice,
    guests,
    days,
    rental,
    paymentToken
  } = req.body;
  // = get user from locals created in User Model
  const user = res.locals.user;

  // creating booking localy
  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

  // geting rental by id (also from request)
  Rental.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec(async function(err, foundRental) {
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

        // creating new Payment
        const { payment, err } = await createPayment(
          booking,
          foundRental.user,
          paymentToken
        );

        // if payment was created successfully - create booking next
        if (payment) {
          booking.payment = payment;

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
          // payment error
          return res.status(422).send({
            errors: [
              {
                title: 'Payment Error',
                detail: err
              }
            ]
          });
        }
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

// = get all bookings created by this User
exports.getUserBookings = function(req, res) {
  const user = res.locals.user;

  Booking.where({ user })
    .populate('rental')
    .exec((err, foundBookings) => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json(foundBookings);
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

// creating new Payment
async function createPayment(booking, toUser, token) {
  // getting fromUser
  const user = booking.user;

  // creating Stripe customer to charge him his debt
  const customer = await stripe.customers.create({
    source: token.id,
    email: user.email
  });

  if (customer) {
    // updating User, who wants to book Rental with his customer id from Stripe api
    User.update(
      { _id: user.id },
      { $set: { stripeCustomerId: customer.id } },
      () => {}
    );

    // creating new Payment (keeping 20% of amount to my service)
    const payment = new Payment({
      fromUser: user,
      toUser,
      fromStripeCustomerId: customer.id,
      booking,
      tokenId: token.id,
      amount: booking.totalPrice * 100 * CUSTOMER_SHARE
    });

    // saving payment to DB
    try {
      const savedPayment = await payment.save();
      return { payment: savedPayment };
    } catch (error) {
      return { err: error.message };
    }
  } else {
    return { err: 'Cannot process Payment' };
  }
}
