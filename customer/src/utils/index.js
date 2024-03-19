import amqplib from "amqplib";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
} from "../config/index.js";

//Utility functions
// export async function GenerateSalt() {
//   return await genSalt();
// }

export async function GeneratePassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw new Error("error hashing password", err);
  }
  // return await hash(password, salt);
}

export async function ValidatePassword(enteredPassword, savedPassword, salt) {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
}

export async function GenerateSignature(payload) {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function ValidateSignature(req) {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function FormateData(data) {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
}

/* -------------------- Message broker ---------------*/

//create channel
export async function CreateChannel() {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (err) {
    throw err;
  }
}

//Publish message to queue
export async function PublishMessage(channel, binding_key, message) {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message has been sent");
  } catch (err) {
    throw err;
  }
}
// //Consume message from queue
// export async function SubscribeMessage(channel, service) {
//   try {
//     const appQueue = await channel.assertQueue(QUEUE_NAME);
//     channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
//     channel.consume(appQueue.queue, (data) => {
//       console.log(data.content.toString());
//       service.SubscribeEvents(data.content.toString);
//     });
//   } catch (err) {
//     throw err;
//   }
// }
