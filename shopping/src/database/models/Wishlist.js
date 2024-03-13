import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const WishlistSchema = new Schema({
  customerId: { type: String },
  products: [
    {
      _id: { type: String, require: true },
    },
    s,
  ],
});

export default model("wishlist", WishlistSchema);
