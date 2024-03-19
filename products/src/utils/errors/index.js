import * as Sentry from "@sentry/node";
import { SENTRY_KEY } from "../../config/index.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./app-errors.js";

export default (app) => {
  Sentry.init({
    dsn: SENTRY_KEY,
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });

  app.use(Sentry.Handlers.errorHandler());

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
      Sentry.captureException(error);
    }
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });
};
