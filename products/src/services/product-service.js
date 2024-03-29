import { ProductRepository } from "../database/index.js";
import { APIError } from "../utils/errors/app-errors.js";
import { FormateData } from "../utils/index.js";

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    return await this.repository.CreateProduct(productInputs);
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();

      let categories = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return {
        products,
        categories: Object.keys(categories),
      };
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductDescription(productId) {
    try {
      const product = await this.repository.FindById(productId);
      return FormateData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductById(productId) {
    try {
      return await this.repository.FindById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductPayload(userId, { productId }, event) {
    const product = await this.repository.FindById(productId);

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };

      return FormateData(payload);
    } else {
      return FormateData({ error: "No product avaliable" });
    }
  }

  //RPC RESPONSE

  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "VIEW_PRODUCT":
        return this.repository.FindById(data);
        break;
      case "VIEW_PRODUCTS":
        return this.repository.FindSelectedProducts(data);
        break;
      default:
        break;
    }
  }
}

export default ProductService;
