const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { MSG_401_PASS_AND_EMAIL, MSG_400_EMAIL } = require('../utils/constants');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: MSG_400_EMAIL,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    atRegistration: {
      type: Date,
      default: Date.now,
    },
    atLastEntry: {
      type: Date,
      default: Date.now,
    },
  },
);

userSchema.statics.findUserByCredentials = function checkPair(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(MSG_401_PASS_AND_EMAIL);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(MSG_401_PASS_AND_EMAIL);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('TaskUser', userSchema);
