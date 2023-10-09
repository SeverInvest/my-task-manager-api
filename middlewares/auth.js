const jwt = require("jsonwebtoken");
const TaskUser = require("../models/user");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { jwtSecret } = require("../config");
const { MSG_401_NEEDED_AUTH } = require("../utils/constants");

module.exports = async (req, _, next) => {
  const { authorization } = req.headers;
  let payload;
  let token;
  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError(MSG_401_NEEDED_AUTH);
    } else {
      token = authorization.replace("Bearer ", "");
    }
  } catch (err) {
    next(err);
  }
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    next(new UnauthorizedError(MSG_401_NEEDED_AUTH));
    return;
  }
  try {
    const user = await TaskUser.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError(MSG_401_NEEDED_AUTH);
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
