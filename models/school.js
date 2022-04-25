const mongoose = require('mongoose');
const Joi = require('joi');
const { date } = require('joi');

const School = mongoose.model(
  'School',
  new mongoose.Schema({
    schoolId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      min: 3,
      max: 255,
      required: true,
    },
    phone: {
      type: String,
      min: 10,
      max: 20,
    },
    module: {
      type: String,
      enum: ['full', 'half'],
    },
    subscriptionDate: {
      type: Date,
      required: true,
    },
    subscriptionPassword: {
      type: String,
    },
  })
);

const validateSchool = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    schoolId: Joi.string().required(),
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Schoole name should not be empty!';
              break;
            case 'string.min':
              err.message = `Schoole name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Schoole name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    phone: Joi.string().min(10).max(20),
    module: Joi.string(),
    subscriptionDate: Joi.date().required(),
    subscriptionPassword: Joi.string(),
  });

  try {
    const value = await schema.validateAsync(data);
    console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err.details[0].message);
  }
};

exports.School = School;
exports.validateSchool = validateSchool;
