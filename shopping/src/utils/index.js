import amqplib from "amqplib";
import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";
import {
  APP_SECRET,
  EXCHANGE_NAME,
  SHOPPING_BINDING_KEY,
} from "../config/index.js";

let amqplibConnection = null;

//Utility functions
export async function GenerateSalt() {
  return await genSalt();
  utis;
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
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect("amqp://localhost");
  }
  return await amqplibConnection.createChannel();
};

//create channel
export async function CreateChannel() {
  try {
    const channel = await getChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
}

//publish message
export async function PublishMessage(channel, service, message) {
  try {
    await channel.publish(EXCHANGE_NAME, service, Buffer.from(message));
    console.log("message sent", message);
  } catch (err) {
    throw err;
  }
}

//subscribe message
export async function SubscribeMessage(channel, service) {
  try {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`waiting for messages: ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
    channel.consume(q.queue, (msg) => {
      if (msg.content) {
        console.log(msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[x], received");
    }),
      {
        noAck: true,
      };
  } catch (err) {
    throw err;
  }
}

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    const channel = await getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout
      const timeout = setTimeout(() => {
        channel.close();
        resolve("API could not fullfil the request!");
      }, 8000);
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};
