const InventoryRepository = require("../repository/InventoryRepository");
const kafka = require("../../kafka");

const consumer = kafka.consumer({ groupId: "inventory-service-group" });
consumer
  .connect()
  .then(() => {
    console.log("Kafka consumer connected");
  })
  .catch((error) => {
    console.error("Error connecting Kafka consumer:", error);
  });

const updateInventoryForProductIds = async (items) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    const response =
      await InventoryRepository.updateInventoryForProductIds(items);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating inventory");
  }
};

const getInventoryByProductIds = async (productIds) => {
  try {
    const inventoryProducts =
      await InventoryRepository.getInventoryByProductIds(productIds);
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

    if (Number(available_quantity) < Number(orderedItem.quantity)) {
      allStocksAvailable = false;
      console.log(`Insufficient stock for product ${item.product_id}`);
    }
  }
  return allStocksAvailable;
};

const processOrderCreatedEvent = async (event) => {
  try {
    console.log("Processing ORDER_CREATED event:", event.data);
    const productIds = event.data.items.map((item) => item.productId);
    const inventoryProducts = await getInventoryByProductIds(productIds);

    const itemMap = new Map();
    for (const item of event.data.items) {
      itemMap.set(item.productId, item);
    }
    if (validateStockAvailability(inventoryProducts, itemMap)) {
      await updateInventoryForProductIds(event.data.items);
    } else {
      console.log(
        "Insufficient stock for one or more products. Cannot update inventory.",
      );
    }
  } catch (error) {
    console.error("Error processing ORDER_CREATED event:", error);
  }
};

const startConsumer = async () => {
  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  console.log("Starting Kafka consumer run for inventory-service");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        console.log("Received message:", message.value.toString());
        const event = JSON.parse(message.value.toString());
        if (event.type === "ORDER_CREATED") {
          await processOrderCreatedEvent(event);
        }
      } catch (error) {
        console.log("Kafka not ready (group coordinator), retrying in 3s...");
        await new Promise((res) => setTimeout(res, 3000));
      }
    },
  });
};

startConsumer();

// module.exports = {
//   startConsumer,
// };
