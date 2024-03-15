import express from "express";
import { PORT } from "./config/index.js";
import { databaseConnection } from "./database/index.js";
import expressApp from "./express-app.js";
import errorHandler from "./utils/errors/index.js";
import { CreateChannel } from "./utils/index.js";

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  errorHandler(app);

  //catch all errors, format and report to logger
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
