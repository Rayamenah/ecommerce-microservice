import { config } from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  config({ path: configFile });
} else {
  config();
}

export const PORT = process.env.PORT;
export const DB_URL = process.env.MONGODB_URI;
export const APP_SECRET = process.env.APP_SECRET;
export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;
export const EXCHANGE_NAME = "ONLINE_SHOPPING";
export const CUSTOMER_BINDING_KEY = "CUSTOMER_SERVICE";
export const QUEUE_NAME = "SHOPPING_QUEUE";
export const SENTRY_KEY = process.env.SENTRY_KEY;
