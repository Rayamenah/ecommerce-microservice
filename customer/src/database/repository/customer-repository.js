import {
  APIError,
  NotFoundError,
  STATUS_CODES,
} from "../../utils/errors/app-errors.js";
import { AddressModel, CustomerModel } from "../models/index.js";

//Dealing with data base operations
export default class CustomerRepository {
  async CreateCustomer(userInputs) {
    const { email, password, phone, salt } = userInputs;
    try {
      //check if customer exists
      // const existingCustomer = await CustomerModel.findOne(email);
      // if (!existingCustomer) {
      //   throw new Error("user already exists");
      // }
      const customer = new CustomerModel({
        email,
        password,
        phone,
        address: [],
      });

      const customerResult = await customer.save();
      return customerResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);
      if (!profile) throw new NotFoundError("user not found");
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country,
      });

      await newAddress.save();

      profile.address.push(newAddress);

      return await profile.save();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );

      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async DeleteCustomerById(id) {
    return CustomerModel.findByIdAndDelete(id);
  }
}

// export default CustomerRepository;
