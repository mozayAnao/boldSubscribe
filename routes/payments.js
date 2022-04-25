const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const payments = await Payment.find();

  res.send(payments);
});

router.post('/', auth, async (req, res) => {
  const payment = new Payment(
    _.pick(req.body, [
      'schoolId',
      'amount',
      'subscriptionDate',
      'nextSubsciptionDate',
    ])
  );

  payment = await payment.save();

  res.send(payment);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment)
    return res.status(404).send('The payment with the given ID does not exist');

  res.send(payment);
});

module.exports = router;
