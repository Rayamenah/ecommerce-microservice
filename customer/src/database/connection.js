import mongoose from "mongoose";
import { DB_URL } from "../config/index.js";

export default async () => {
  try {
    mongoose.connect(DB_URL);
    console.log("Db connected");
  } catch (err) {
    console.log(err);
  }
};
