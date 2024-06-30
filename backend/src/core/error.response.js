"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZED: 420,
  NOTFOUND: 404,
  FORBIDDEN: 401,
};
const ReasonStatusCode = {
  FORBIDDEN: "bad request error",
  CONFLICT: "conflict error",
  UNAUTHORIZED: 'unauthorized reason',
  NOTFOUND: 'not found',
  FORBIDDEN: 'forbidden error'
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.mystatus = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    myStatusCode = StatusCode.CONFLICT
  ) {
    super(message, myStatusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    myStatusCode = StatusCode.FORBIDDEN
  ) {
    super(message, myStatusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    myStatusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, myStatusCode);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOTFOUND,
    myStatusCode = StatusCode.NOTFOUND
  ) {
    super(message, myStatusCode);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    myStatusCode = StatusCode.FORBIDDEN
  ) {
    super(message, myStatusCode);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
};
