const InventoryRepository = require('../Repository/InventoryRepository');

const validateStockAvailability = (inventoryProducts, itemMap) => {
  let allStocksAvailable = true;
  for (const item of inventoryProducts) {
    const available_quantity = item.available_quantity - item.reserved_quantity;
    const orderedItem = itemMap.get(item.product_id);
    if (!orderedItem || available_quantity < orderedItem?.quantity) {
      allStocksAvailable = false;
    }
  }
  return allStocksAvailable;
};

const updateInventoryForProductIds = async (client, items) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    await InventoryRepository.updateInventoryForProductIds(client, items);
  } catch (error) {
    console.error(error);
    throw new Error("Error updating inventory");
  }
};

const getInventoryByProductIds = async (client, productIds) => {
  try {
    const inventoryProducts =
      await InventoryRepository.getInventoryByProductIds(client, productIds);
    return inventoryProducts;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching inventory");
  }
};

module.exports = {
  validateStockAvailability,
  updateInventoryForProductIds,
  getInventoryByProductIds,
};
