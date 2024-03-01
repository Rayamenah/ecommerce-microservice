import { genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import amqplib from "amqplib";
import {
  APP_SECRET,
  QUEUE_NAME,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  CUSTOMER_BINDING_KEY,
} from "../config";

//Utility functions
export async function GenerateSalt() {
  return await genSalt();
}

export async function GeneratePassword(password, salt) {
  return await hash(password, salt);
}

export async function ValidatePassword(enteredPassword, savedPassword, salt) {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
}

export async function GenerateSignature(payload) {
  try {
    return await sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function ValidateSignature(req) {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await verify(signature.split(" ")[1], APP_SECRET);
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

//subscribe message
export async function SubscribeMessage(channel, service) {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
    channel.consume(appQueue.queue, (data) => {
      console.log("recieved data");
      console.log(data.content.toString());
      service.SubscribeEvents(data.content.toString);
    });
  } catch (err) {
    throw err;
  }
}
