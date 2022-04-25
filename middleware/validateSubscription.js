const Joi = require('joi');

const validateAuth = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    schoolId: Joi.string().min(3).max(10).required(),

    password: Joi.string().min(12).max(15).required(),
  });

  try {
    const value = await schema.validateAsync(data);
    // console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.details[0].message });
  }
};

module.exports = validateAuth;
