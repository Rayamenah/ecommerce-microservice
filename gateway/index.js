import express, { json } from "express";
import cors from "cors";
import proxy from "express-hhttp-proxy";

const app = express();

app.use(cors());
app.use(json());

app.use("/customer", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8003"));
app.use("/", proxy("http://localhost:8002")); // products route
app.listen(8002, () => {
  console.log("customer is istening on port 8001");
});
