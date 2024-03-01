import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const AddressSchema = new Schema({
  street: String,
  postalCode: String,
  city: String,
  country: String,
});

export default model("address", AddressSchema);
