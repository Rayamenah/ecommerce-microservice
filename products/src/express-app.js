import express from "express";
import cors from "cors";
import { products } from "./api/index.js";

export default async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  // app.use(express.static(__dirname + "/public"));
  //api
  products(app, channel);
};
