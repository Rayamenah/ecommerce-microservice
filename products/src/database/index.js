// database related modules
// export const databaseConnection = require("./connection").default;
// export const ProductRepository =
//   require("./repository/product-repository").default;

import databaseConnection from "./connection.js";
import ProductRepository from "././repository/product-repository.js";

export { databaseConnection, ProductRepository };
