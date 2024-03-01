import express, { json } from "express";

const app = express();
app.use(json());

app.use("/", (req, res, next) => {
  res.status(200).send("hello from products");
});
app.listen(8002, () => {
  console.log("customer is istening on port 8001");
});
