const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { School, validateSchool } = require('../models/school');
const validateSubscription = require('../middleware/validateSubscription');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const cors = require('cors');

router.get('/', auth, async (req, res) => {
  const schools = await School.find();

  res.send(schools);
});

router.get('/:id', auth, async (req, res) => {
  const school = await School.findById(req.params.id);

  if (!school)
    return res.status(404).send('The school with the given ID does not exist');

  res.send(school);
});

router.post('/', [auth, admin, validateSchool], async (req, res) => {
  let school = await School.findOne({ schoolId: req.body.schoolId });
  if (school) return res.status(400).send('This school already exists');

  school = new School(
    _.pick(req.body, [
      'schoolId',
      'name',
      'phone',
      'module',
      'subscriptionDate',
    ])
  );

  school = await school.save();

  res.json(school);
});

router.post('/subscribe', [cors(), validateSubscription], async (req, res) => {
  let school = await School.findOne({ schoolId: req.body.schoolId });
  if (!school) return res.status(400).send('Invalid request');

  if (req.body.password !== school.subscriptionPassword)
    return res.status(400).json({ subscribed: false });

  school.subscriptionPassword = '';

  await School.updateOne({ schoolId: school.schoolId }, school);

  res.json({
    nextSubscriptionDate: school.subscriptionDate,
    subscribed: true,
  });
});

router.put('/:id', [auth, validateSchool], async (req, res) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body);

  if (!school)
    return res.status(404).send('The School with the given ID does not exist');

  res.send(school);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const school = await School.findByIdAndDelete(req.params.id);
  if (!school)
    return res.status(404).send('The school with the given ID does not exist');

  res.send(school);
});

module.exports = router;
