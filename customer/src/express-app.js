import cors from "cors";
import express from "express";
import { customer } from "./api/index.js";

export default async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  // app.use(express.static(__dirname + "/public"));

  customer(app, channel);
};
