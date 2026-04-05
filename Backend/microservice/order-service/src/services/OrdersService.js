const OrdersRepository = require("../repository/OrdersRepository");
const kafka = require("../../kafka");

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (error) {
    console.error("Error connecting Kafka producer:", error);
    await new Promise(res => setTimeout(res, 3000));
  }
};

connectProducer();

const getOrders = async (page, limit) => {
  try {
    const orders = await OrdersRepository.getOrders(page, limit);
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching orders");
  }
};

const getOrderById = async (id) => {
  try {
    const order = await OrdersRepository.getOrderById(id);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching order by ID");
  }
};

const createOrder = async (data) => {
  try {
    // create order
    const order = await OrdersRepository.createOrder(data);
    // const order = { id: Date.now() };

    await producer.send({
      topic: "orders",
      messages: [
        {
          key: order.id.toString(),
          value: JSON.stringify({
            type: "ORDER_CREATED",
            data,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    // return created order
    return order;
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("Error creating order");
  }
};

const updateOrderStatus = async (data) => {
  try {
    const order = await OrdersRepository.updateOrder(data);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating order");
  }
};

const deleteOrder = async (id) => {
  try {
    const order = await OrdersRepository.deleteOrder(id);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting order");
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
};
