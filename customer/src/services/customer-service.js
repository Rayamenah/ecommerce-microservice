import { CustomerRepository } from "../database/index.js";
import {
  APIError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors/app-errors.js";
import {
  GeneratePassword,
  // GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utils/index.js";

// All Business logic will be here
export default class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;
    try {
      let userPassword = await GeneratePassword(password);
      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
      });
      const token = await GenerateSignature({
        email: email,
        _id: customer._id,
      });

      return { id: customer._id, token };
    } catch (err) {
      throw new APIError("couldn not create customer", err);
    }
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    const existingCustomer = await this.repository.FindCustomer({ email });
    if (!existingCustomer) throw new NotFoundError("user not found");

    const validPassword = await ValidatePassword(
      password,
      existingCustomer.password,
      existingCustomer.salt
    );

    if (!validPassword)
      throw new UnauthorizedError("invalid email or password");

    const token = await GenerateSignature({
      email: existingCustomer.email,
      _id: existingCustomer._id,
    });

    return { id: existingCustomer._id, token };
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;
    return this.repository.CreateAddress({
      _id,
      street,
      postalCode,
      city,
      country,
    });
  }

  async GetProfile(id) {
    return this.repository.FindCustomerById({ id });
  }

  async DeleteProfile(id) {
    const data = await this.repository.DeleteCustomerById(id);
    const payload = {
      event: "DELETE PROFILE",
      data: { id },
    };
    return { data, payload };
  }
}
