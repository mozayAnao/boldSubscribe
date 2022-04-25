const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    min: 3,
    max: 10,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Name should not be empty!';
              break;
            case 'string.min':
              err.message = `Name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    username: Joi.string()
      .min(3)
      .max(10)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Username should not be empty!';
              break;
            case 'string.min':
              err.message = `Username should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Username should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .min(5)
      .max(255)
      .required(),

    isAdmin: Joi.boolean(),
  });

  try {
    const value = await schema.validateAsync(data);
    console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.details[0].message });
  }
};

exports.User = User;
exports.validateUser = validateUser;
