const { STATUS_CONFLICTED } = require('../utils/statuses');
const ApplicationError = require('./ApplicationError');

class ConflictedError extends ApplicationError {
  constructor(message) {
    super(message);
    this.status = STATUS_CONFLICTED;
  }
}
// 'Such a user already exists', 'Such a video already exists'

module.exports = ConflictedError;
