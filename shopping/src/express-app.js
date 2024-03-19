import cors from "cors";
import express from "express";
import { shopping } from "./api/index.js";

export default async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  // app.use(express.static(__dirname + "/public"));

  //api,
  shopping(app, channel);
};
