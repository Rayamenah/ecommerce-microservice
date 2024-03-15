const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

class BaseError extends Error {
  constructor(name, statusCode, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// 500 Internal error
class APIError extends BaseError {
  constructor(description = "API Error") {
    super(
      "API Internal Server Error",
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      description
    );
  }
}
// 400 Validation Error
class ValidationError extends BaseError {
  constructor(description = "Bad Request") {
    super("Bad Request", STATUS_CODES.BAD_REQUEST, description);
  }
}

// 403 Unauthorized
class UnauthorizedError extends BaseError {
  constructor(description = "Access Denied") {
    super("Access Denied", STATUS_CODES.UNAUTHORISED, description);
  }
}

// 404 Not Found
class NotFoundError extends BaseError {
  constructor(description = "Not Found") {
    super("Bad Request", STATUS_CODES.NOT_FOUND, description);
  }
}

export { APIError, NotFoundError, UnauthorizedError, ValidationError };
