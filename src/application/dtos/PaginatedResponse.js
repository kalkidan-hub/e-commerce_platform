class PaginatedResponse {
  constructor({
    success = true,
    message = '',
    object = [],
    pageNumber = 1,
    pageSize = 10,
    totalSize = 0,
    errors = null,
  } = {}) {
    this.success = success;
    this.message = message;
    this.object = object;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalSize = totalSize;
    this.errors = errors;
  }
}

module.exports = PaginatedResponse;

