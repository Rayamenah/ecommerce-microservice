import ProductService from "../services/product-service.js";
import { RPCObserver } from "../utils/index.js";

export default (app, channel) => {
  const service = new ProductService();
  RPCObserver("PRODUCT_RPC", service);

  app.post("/product/create", async (req, res, next) => {
    try {
      // const { name, desc, type, unit, price, available, suplier, banner } = req.body;
      // validation
      const data = await service.CreateProduct({
        ...req.body,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;
    try {
      const data = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;
    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).json({ err });
      next(err);
    }
  });

  app.post("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
