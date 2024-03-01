import { connect } from "mongoose";
import { DB_URL } from "../config";

export default async () => {
  try {
    await connect(DB_URL);
    console.log("Db Connected");
  } catch (error) {
    console.log("Error ============");
    console.log(error);
    process.exit(1);
  }
};
