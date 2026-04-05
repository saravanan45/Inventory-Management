const OrdersRepository = require("../repository/OrdersRepository");
const kafka = require("../../kafka");

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service-group" });

const connectProducer = async () => {
  while (true) {
    try {
      await producer.connect();
      console.log("Kafka producer connected");
      break;
    } catch (error) {
      console.error(
        "Error connecting Kafka producer, retrying in 3s:",
        error.message,
      );
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

const connectConsumer = async () => {
    try {
      await consumer.connect();
      console.log("Kafka consumer connected");
      await consumer.subscribe({ topic: "inventory", fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            console.log("Received message:", message.value.toString());
            const event = JSON.parse(message.value.toString());
            if (event.type === "INVENTORY_UPDATED") {
              console.log("Processing INVENTORY_UPDATED event:", event.data);
              await updateOrderStatus({ id: event?.data?.id, status: "CONFIRMED" });
            }
            if(event.type === "INVENTORY_UPDATE_FAILED") {
              console.log("Processing INVENTORY_UPDATE_FAILED event:", event.data);
              await updateOrderStatus({ id: event?.data?.id, status: "FAILED" });
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error starting Kafka consumer:", error);
      setTimeout(connectConsumer, 3000);
    }
};

connectProducer();
connectConsumer();

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
            data: {...data, id: order.id },
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
    const order = await OrdersRepository.updateOrderStatus(data);
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
