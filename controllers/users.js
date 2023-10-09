const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TaskUser = require("../models/user");
const { STATUS_OK, STATUS_CREATED } = require("../utils/statuses");
const NotFoundError = require("../errors/NotFoundError");
const ConflictedError = require("../errors/ConflictedError");
const { MSG_404, MSG_409_USER } = require("../utils/constants");
const { jwtSecret } = require("../config");

async function searchUserById(userId, res, next) {
  try {
    const user = await TaskUser.findById(userId);
    if (!user) {
      throw new NotFoundError(MSG_404);
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(userId, values, res, next) {
  try {
    const user = await TaskUser.findByIdAndUpdate(userId, values, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFoundError(MSG_404);
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
}

module.exports.getCurrentUser = (req, res, next) => {
  searchUserById(req.user._id, res, next);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    // const userRole = await Role.findOne({ value: "USER" });
    const tryUser = await TaskUser.findOne({ email: req.body.email });
    if (tryUser) {
      throw new ConflictedError(MSG_409_USER);
    }
    const user = await TaskUser.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });
    await user.save();
    res.status(STATUS_CREATED).send({
      email: user.email,
      name: user.name,
      _id: user._id,
      atRegistration: user.atRegistration,
      atLastEntry: user.atLastEntry,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req.user._id, { name, email }, res, next);
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await TaskUser.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      // nodeEnv === 'production' &&
      jwtSecret,
      { expiresIn: "24h" },
    );
    user.atLastEntry = Date.now();
    await user.save();
    res.status(STATUS_OK).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (_, res, next) => {
  try {
    const users = await TaskUser.find({});
    // if (!users) {
    //   throw new NotFoundError(MSG_404);
    // }
    res.status(STATUS_OK).send(users);
  } catch (err) {
    next(err);
  }
};
