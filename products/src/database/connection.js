import { DB_URL } from "../config/index.js";
import { MongoClient } from "mongodb";

export default async () => {
  const client = new MongoClient(DB_URL);
  try {
    await client.connect();
    console.log("Db Connected");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
};
