import express from "express";
import cors from "cors";
import { customer, appEvent } from "./api/index.js";
import HandleErrors from "./utils/error-handler.js";

export default async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  // app.use(express.static(__dirname + "/public"));

  //listen to events
  appEvent(app);

  //api
  customer(app, channel);

  // error handling
  app.use(HandleErrors);
};
