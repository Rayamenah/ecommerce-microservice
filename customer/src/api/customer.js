import CustomerService from "../services/customer-service.js";
import { PublishMessage } from "../utils/index.js";
import UserAuth from "./middlewares/auth.js";

export default (app, channel) => {
  const service = new CustomerService();

  // SubscribeMessage(channel, service);

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const data = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      // const { email, password } = req.body;
      const data = await service.SignIn(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      // const { street, postalCode, city, country } = req.body;
      const data = await service.AddNewAddress(_id, {
        ...req.body,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data, payload } = await service.DeleteProfile(_id);
      //send messge to shopping service to remove cart and wishlist
      PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};
