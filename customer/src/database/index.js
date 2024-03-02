// // database related modules
// export const databaseConnection = require("./connection.js").default;
// export const CustomerRepository =
//   require("./repository/customer-repository.js").default;

// Import the `databaseConnection` from connection.js
import databaseConnection from "./connection.js";

// Export the `databaseConnection`
export { databaseConnection };

// Import the `CustomerRepository` from customer-repository.js
import CustomerRepository from "./repository/customer-repository.js";

// Export the `CustomerRepository`
export { CustomerRepository };
