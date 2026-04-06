const InventoryRepository = require("../repository/InventoryRepository");
const kafka = require("../../kafka");
const pool = require("../../db")

const consumer = kafka.consumer({ groupId: "inventory-service-group" });
const producer = kafka.producer();

const connectConsumer = async () => {
    try {
      await consumer.connect();
      console.log("Kafka consumer connected");
      await consumer.subscribe({ topic: "orders", fromBeginning: true });
      console.log("Starting Kafka consumer run for inventory-service");
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Received message:", message.value.toString());
            const event = JSON.parse(message.value.toString());
            if (event.type === "ORDER_CREATED") {
              await processOrderCreatedEvent(event, message.id);
            }
          }
        });
    } catch (error) {
      console.error(
        "Error connecting Kafka consumer, retrying in 3s:",
        error.message,
      );
      setTimeout(connectConsumer, 3000);
    }
};

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

connectProducer();
connectConsumer();

const updateInventoryForProductIds = async (items, client) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    const response =
      await InventoryRepository.updateInventoryForProductIds(items, client);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating inventory");
  }
};

const getInventoryByProductIds = async (productIds, client) => {
  try {
    const inventoryProducts =
      await InventoryRepository.getInventoryByProductIds(productIds, client);
    return inventoryProducts;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching inventory");
  }
};

const validateStockAvailability = (inventoryProducts, itemMap) => {
  let allStocksAvailable = true;
  for (const item of inventoryProducts) {
    const available_quantity = item.available_quantity - item.reserved_quantity;
    const orderedItem = itemMap.get(item.product_id);

    console.log(
      `Available quantity for product ${item.product_id}: ${available_quantity}, Ordered quantity: ${orderedItem.quantity}`,
    );
    if (Number(available_quantity) < Number(orderedItem.quantity)) {
      allStocksAvailable = false;
      console.log(`Insufficient stock for product ${item.product_id}`);
    }
  }
  return allStocksAvailable;
};

const checkOrderIsAlreadyProcessed = async (orderId, client) => {
  try {
    const result =
      await InventoryRepository.checkOrderIsAlreadyProcessed(orderId, client);
    return result;
  } catch (error) {
    console.error("Error checking if order is already processed:", error);
    throw new Error("Error checking order status");
  }
};

const updateProcessedEvents = async (orderId, client) => {
  try {
    await InventoryRepository.updateProcessedEvents(orderId, client);
  } catch (error) {
    console.error("Error updating processed events:", error);
    throw new Error("Error updating processed events");
  }
};

const processOrderCreatedEvent = async (event) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (await checkOrderIsAlreadyProcessed(event?.data?.id, client)) {
      console.log(`Order ${event?.data?.id} is already processed.`);
      await client.query("ROLLBACK");
      return;
    }

    console.log(
      "Processing ORDER_CREATED event:",
      event.data,
      "id:",
      event?.data?.id,
    );
    const productIds = event.data.items.map((item) => item.product_id);
    const inventoryProducts = await getInventoryByProductIds(productIds, client);

    const itemMap = new Map();
    for (const item of event.data.items) {
      itemMap.set(item.product_id, item);
    }

    console.log("Inventory products:", inventoryProducts, "itemMap:", itemMap);
    
    if (validateStockAvailability(inventoryProducts, itemMap)) {
      await updateInventoryForProductIds(event.data.items, client);
      await producer.send({
        topic: "inventory",
        messages: [
          {
            key: event?.data?.id.toString(),
            value: JSON.stringify({
              type: "INVENTORY_UPDATED",
              data: { ...event.data, id: event?.data?.id },
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
    } else {
      console.log(
        "Insufficient stock for one or more products. Cannot update inventory.",
      );
      await producer.send({
        topic: "inventory",
        messages: [
          {
            key: event?.data?.id.toString(),
            value: JSON.stringify({
              type: "INVENTORY_UPDATE_FAILED",
              data: { ...event.data, id: event?.data?.id },
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
    }
    await updateProcessedEvents(event?.data?.id, client);
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error processing ORDER_CREATED event:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// module.exports = {
//   startConsumer,
// };
