const Payment = require('../models/payment');
const { normalizeErrors } = require('../helpers/mongoose');

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
    .populate('user')
    .exec(function(err, foundPayments) {
      if (err) {
        return res.status(422).send({ error: normalizeErrors(err.errors) });
      }

      return res.json(foundPayments);
    });
};
