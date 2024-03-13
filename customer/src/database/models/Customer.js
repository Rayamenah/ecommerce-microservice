import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const CustomerSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    phone: { type: String },
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export default model("customer", CustomerSchema);
