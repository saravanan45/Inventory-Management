const OrdersService = require("../services/OrdersService");
const response = require("../../Common/APIResponses");

const getOrders = async (req, res) => {
  const { page = 0, limit = 10 } = req.query || {};
  try {
    const orders = await OrdersService.getOrders(page, limit);
    return res.status(201).json(response.success(orders));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Order ID is required" });
  try {
    const order = await OrdersService.getOrderById(id);
    if (!order) return res.status(404).json(response.error("Order not found"));
    return res.status(201).json(response.success(order));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const createOrder = async (req, res) => {
  const { items, user_id } = req.body;
  if (!items) return res.status(400).json({ error: "Items are required" });
  if (!user_id) return res.status(400).json({ error: "User ID is required" });
  try {
    const order = await OrdersService.createOrder(req.body);
    return res.status(201).json(response.success(order));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(response.error(err.message || "Internal Server Error"));
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Order ID is required" });
  try {
    const order = await OrdersService.updateOrder(req.body);
    return res.status(201).json(response.success(order));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Order ID is required" });
  try {
    const order = await OrdersService.deleteOrder(id);
    return res.status(201).json(response.success(order));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const createBulkOrders = async (req, res) => {
  try {
    const orders = [];
    for (let i = 1; i <= 10; i++) {
      const order = {
        user_id: 112,
        total_amount: 200,
        payment_status: "PAID",
        currency: "INR",
        items: [
          {
            product_id: i,
            quantity: "1",
            price_at_purchase: "100",
          },
        ],
      };

      const createdOrder = await OrdersService.createOrder(order);
      orders.push(createdOrder);
    }
    return res
      .status(201)
      .json(response.success({ message: "Bulk orders created successfully", orders }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  createBulkOrders,
};
