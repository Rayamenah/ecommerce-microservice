import ShoppingService from "../services/shopping-service.js";
import { SubscribeMessage } from "../utils/index.js";
import UserAuth from "./middlewares/auth.js";

export default (app, channel) => {
  const service = new ShoppingService();
  SubscribeMessage(channel, service);

  // CART

  app.post("/cart", async (req, res, next) => {
    const { _id } = req.user;
    const { product_id, qty } = req.body;
    try {
      const data = await service.AddCartItem(_id, product_id, qty);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  app.delete("/cart/:id", async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    try {
      const data = await service.RemoveCartItem(_id, productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const data = await service.GetCart(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //WISHLIST
  app.post("/wishlist", async (req, res, next) => {
    const { _id } = req.user;
    const { product_id } = req.body;
    const data = await service.AddToWishlist(_id, product_id);
    return res.status(200).json(data);
  });
  app.get("/wishlist", async (req, res, next) => {
    const data = await service.GetWishlist(_id);
    return res.status(200).json(data);
  });
  app.delete("/wishlist/:id", async (req, res, next) => {
    const { _id } = req.user;
    const { product_id } = req.body;
    const data = await service.RemoveFromWishlist(_id, product_id);
    return res.status(200).json(data);
  });

  //ORDERS
  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const data = await service.CreateOrder({ _id, txnNumber });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/order/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const data = await service.GetOrder(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const data = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  s;
};
