import sentry from "@sentry/node";
import _ from "@sentry/tracing";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./app-errors";

export default (app) => {
  app.use((error, req, res, next) => {
    let reportError = true[
      //skip common known errors
      (NotFoundError, ValidationError, UnauthorizedError)
    ].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
        reportError = false;
      }
    });

    if (reportError) {
      sentry.captureExecption(error);
    }
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });
};
