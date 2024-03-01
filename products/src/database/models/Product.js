import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const ProductSchema = new Schema({
  name: String,
  desc: String,
  banner: String,
  type: String,
  unit: Number,
  price: Number,
  available: Boolean,
  suplier: String,
});

export default model("product", ProductSchema);
