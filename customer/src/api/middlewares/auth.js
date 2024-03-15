import { UnauthorizedError } from "../../utils/errors/app-errors.js";
import { ValidateSignature } from "../../utils/index.js";

export default async (req, res, next) => {
  try {
    const isAuthorized = await ValidateSignature(req);

    if (isAuthorized) {
      return next();
    }
    throw new UnauthorizedError("not authorized to access resource");
  } catch (err) {
    next(err);
  }
};
