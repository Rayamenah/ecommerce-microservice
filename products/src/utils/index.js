import amqplib from "amqplib";
import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
} from "../config/index.js";
import { v4 as uuid4 } from "uuid";

let amqplibConnection = null;

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
//get channel
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
  }
  return await amqplibConnection.createChannel();
};

//create channel
export async function CreateChannel() {
  try {
    const channel = await getChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (err) {
    throw err;
  }
}

//publish message
export async function PublishMessage(channel, binding_key, message) {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message has been sent");
  } catch (err) {
    throw err;
  }
}

export const RPCObserver = async (RPC_QUEUE_NAME, service) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg) => {
      if (msg.content) {
        // DB Operation
        const payload = JSON.parse(msg.content.toString());
        const response = await service.serveRPCRequest(payload);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};
