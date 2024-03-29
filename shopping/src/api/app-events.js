import CustomerService from "../services/shopping-service.js";

export default (app) => {
  const service = new CustomerService();

  app.use("./app-events", async (req, res, next) => {
    const { payload } = req.body;

    service.SubscribeEvents(payload);

    console.log("======== shopping service received event ========");
    return res.status(200).json(payload);
  });
};
