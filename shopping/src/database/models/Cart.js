import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const CartSchema = new Schema({
  customerId: { type: String },
  items: [
    {
      product: {
        _id: { type: String },
        name: { type: String },
        img: { type: String },
        unit: { type: Number },
        price: { type: Number },
      },
      unit: { type: Number, require: true },
    },
  ],
});

export default model("cart", CartSchema);
