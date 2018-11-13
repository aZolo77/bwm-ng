const Payment = require('../models/payment');
const Booking = require('../models/booking');
const User = require('../models/user');
const Rental = require('../models/rental');

const { normalizeErrors } = require('../helpers/mongoose');
const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);

// get all pending payments for User
exports.getPendingPayments = function(req, res) {
  const user = res.locals.user;

  // find payment and populate is with booking and rental for this booking
  Payment.where({ toUser: user })
    .populate({
      path: 'booking',
      populate: {
        path: 'rental'
      }
    })
    .populate('fromUser')
    .exec(function(err, foundPayments) {
      if (err) {
        return res.status(422).send({ error: normalizeErrors(err.errors) });
      }

      return res.json(foundPayments);
    });
};

// accept payment for booking
exports.confirmPayment = function(req, res) {
  const payment = req.body;
  const user = res.locals.user;

  Payment.findById(payment)
    .populate('toUser')
    .populate('booking')
    .exec(async function(err, foundPayment) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (
        foundPayment.status === 'pending' &&
        user.id === foundPayment.toUser.id
      ) {
        // getting booking which we want to pay for
        const booking = foundPayment.booking;

        // creating charge for Customer
        const charge = await stripe.charges.create({
          amount: booking.totalPrice * 100,
          currency: 'usd',
          customer: payment.fromStripeCustomerId
        });

        if (charge) {
          // updating booking status to active
          Booking.update({ _id: booking }, { status: 'active' }, () => {});

          // update Payment by adding it a charge
          foundPayment.charge = charge;
          foundPayment.status = 'paid';
          foundPayment.save(err => {
            if (err) {
              return res
                .status(422)
                .send({ errors: normalizeErrors(err.errors) });
            }

            // update User who get money
            User.update(
              { _id: foundPayment.toUser },
              // incrementing revenue with $inc operator
              { $inc: { revenue: foundPayment.amount } },
              (err, user) => {
                if (err) {
                  return res
                    .status(422)
                    .send({ errors: normalizeErrors(err.errors) });
                }

                return res.json({ status: 'paid' });
              }
            );
          });
        }
      }
    });
};

// decliniing Payment/Booking
exports.declinePayment = function(req, res) {
  const payment = req.body;
  const { booking } = payment;

  // delete this booking from Bookings
  Booking.deleteOne({ id: booking._id }, (err, deletedBooking) => {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    // update this payment sith status declined
    Payment.update({ _id: payment._id }, { status: 'declined' }, () => {});

    // update Rental with booking if its ID is found in array of bookings
    Rental.update(
      { _id: booking.rental },
      { $pull: { bookings: booking._id } },
      () => {}
    );

    return res.json({ status: 'deleted' });
  });
};
