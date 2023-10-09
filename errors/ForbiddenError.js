const { STATUS_FORBIDDEN_ERROR } = require('../utils/statuses');
const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(message);
    this.status = STATUS_FORBIDDEN_ERROR;
  }
}
// 'Access to execution is forbidden'

module.exports = ForbiddenError;
