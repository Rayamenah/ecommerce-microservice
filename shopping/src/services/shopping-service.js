import { ShoppingRepository } from "../database/index.js";
import { APIError, NotFoundError } from "../utils/errors/app-errors.js";
import { FormateData, RPCRequest } from "../utils/index.js";

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }
  /* -------------- CART-------------- */
  async AddCartItem(customerId, product_id, qty) {
    //get product info from product service through RPC
    const productResponse = await RPCRequest("PRODUCT_RPC", {
      type: "VIEW_PRODUCT",
      data: product._id,
    });
    if (productResponse && product_id) {
      const data = await this.repository.ManageCart(
        customerId,
        productResponse,
        qty
      );
      return data;
    }
    throw new Error("Product data not found");
  }

  async RemoveCartItem(customerId, product_id) {
    return this.repository.ManageCart(customerId, { _id: product_id }, 0, true);
  }
  // async ManageCart(customerId, product, qty, isRemove) {
  //   try {
  //     const cartResult = await this.repository.ManageCart(
  //       customerId,
  //       product,
  //       qty,
  //       isRemove
  //     );
  //     return FormateData(cartResult);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async GetCart(_id) {
    return this.repository.Cart(_id);
  }

  /* -------------- WISHLIST-------------- */
  async AddToWishlist(customerId, product_id) {
    return this.repository.ManageWishlist(customerId, product_id);
  }
  async RemoveFromWishlist(customerId, product_id) {
    return this.repository.ManageWishlist(customerId, product_id);
  }
  async GetWishlist(customerId) {
    const wishlist = await this.repository.GetWishlistByCustomerId(customerId);
    if (!wishlist) {
      return {};
    }
    const { products } = wishlist;
    if (Array.isArray(products)) {
      const ids = products.map(({ _id }) => _id);
      //perform RPC call
      const productResponse = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCTS",
        data: ids,
      });
      if (!productResponse) throw NotFoundError("wishlist not found");
      return productResponse;
    }
    return {};
  }

  /* -------------- ORDERS-------------- */

  async CreateOrder(customerId, txnNumber) {
    // Verify the txn number with payment logs
    try {
      const orderResult = await this.repository.CreateNewOrder(
        customerId,
        txnNumber
      );
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrder(orderId) {
    const order = await this.repository.Orders("", orderId);
    if (!order) throw NotFoundError("orders not found");
    return order;
  }
  async GetOrders(customerId) {
    const orders = await this.repository.Orders(customerId, "");
    if (!orders) throw NotFoundError("orders not found");
    return orders;
  }

  //delete wishlist and cart when profile is deleted
  async deleteProfileData(customerId) {
    return this.repository.deleteProfileData(customerId);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "DELETE_PROFILE":
        await this.deleteProfileData(userId);
        break;
      default:
        break;
    }
  }

  // async SubscribeEvents(payload) {
  //   payload = JSON.parse(payload);
  //   const { event, data } = payload;
  //   switch (event) {
  //     case "DELETE_PROFILE":
  //       await this.deleteProfileData(data.userId);
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // async GetOrderPayload(userId, order, event) {
  //   if (order) {
  //     const payload = {
  //       event: event,
  //       data: { userId, order },
  //     };

  //     return FormateData(payload);
  //   } else {
  //     return FormateData({ error: "No order avaliable" });
  //   }
  // }
}

export default ShoppingService;
