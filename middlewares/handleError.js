const mongoose = require('mongoose');
const ValidationError = require('../errors/ValidationError');
const ApplicationError = require('../errors/ApplicationError');
const { MSG_400, MSG_500 } = require('../utils/constants');

function handleError(error, _, res, next) {
  let httpError = {
    status: 500,
    message: MSG_500,
  };

  if (error instanceof mongoose.Error.CastError) {
    httpError = new ValidationError(MSG_400);
  } else if (error instanceof ApplicationError) {
    httpError = error;
  } else if (error instanceof mongoose.Error.ValidationError) {
    httpError = new ValidationError(error.message);
  }

  res.status(httpError.status).send({ message: httpError.message });

  next();
}

module.exports = handleError;
