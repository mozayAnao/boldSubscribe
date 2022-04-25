var express = require('express');
var router = express.Router();
const { School } = require('../models/school');
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('login', { title: 'Bold Subscribe' });
});

router.get('/home', auth, async function (req, res, next) {
  const schools = await School.find();

  res.render('index', {
    title: 'Bold Subscribe',
    user: req.user,
    schools: schools,
  });
});

module.exports = router;
