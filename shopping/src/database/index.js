// database related modules
// export const databaseConnection = require("./connection").default;
// export const ShoppingRepository =
//   require("./repository/shopping-repository").default;

import databaseConnection from "./connection.js";
import ShoppingRepository from "./repository/shopping-repository";

export { databaseConnection, ShoppingRepository };
