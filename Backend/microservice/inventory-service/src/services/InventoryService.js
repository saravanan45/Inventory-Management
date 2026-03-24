const InventoryRepository = require('../repository/InventoryRepository');

const validateStockAvailability = async (inventoryProducts, itemMap) => {
  let allStocksAvailable = true;
  for (const item of inventoryProducts) {
    const available_quantity = item.available_quantity - item.reserved_quantity;
    const orderedItem = itemMap.get(item.product_id);
    if (available_quantity < orderedItem.quantity) {
      allStocksAvailable = false;
    }
  }
  return allStocksAvailable;
};

const updateInventoryForProductIds = async (items) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    await InventoryRepository.updateInventoryForProductIds(items);
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

module.exports = {
  validateStockAvailability,
  updateInventoryForProductIds,
  getInventoryByProductIds,
};
