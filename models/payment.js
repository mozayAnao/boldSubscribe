const mongoose = require('mongoose');

const Payment = mongoose.model(
  'Payment',
  new mongoose.Schema({
    schoolId: {
      type: String,
      required: true,
      ref: 'School',
    },
    amount: {
      type: Number,
      required: true,
    },
    subscriptionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextSubscriptionDate: {
      type: Date,
      required: true,
    },
  })
);

module.exports = Payment;
