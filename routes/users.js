var express = require('express');
var router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', auth, async function (req, res) {
  const users = await User.find().select('-password');

  res.send(users);
});

router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user)
    return res.status(404).send('The user with the given ID does not exist');

  res.send(user);
});

router.post('/', [auth, admin, validateUser], async (req, res) => {
  let user = await User.findOne({ username: req.body.username });

  if (user) return res.status(400).send('This user already exists');

  user = new User(
    _.pick(req.body, ['name', 'username', 'password', 'isAdmin'])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  res.send(_.pick(user, ['name', 'username', 'isAdmin']));
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return res.status(404).send('The user with the given ID does not exist');

  res.send(user);
});

module.exports = router;
