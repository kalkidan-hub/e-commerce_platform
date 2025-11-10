class BaseResponse {
  constructor({ success = true, message = '', object = null, errors = null } = {}) {
    this.success = success;
    this.message = message;
    this.object = object;
    this.errors = errors;
  }
}

module.exports = BaseResponse;

