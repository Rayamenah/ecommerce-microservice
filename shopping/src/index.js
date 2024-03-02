import express from "express";
import { PORT } from "./config/index.js";
import { databaseConnection } from "./database/index.js";
import expressApp from "./express-app.js";
import { CreateChannel } from "./utils/";

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

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
