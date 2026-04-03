const InventoryRepository = require('../Repository/InventoryRepository');

const updateInventoryForProductIds = async (client, items, action) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    await InventoryRepository.updateInventoryForProductIds(client, items, action);
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
  updateInventoryForProductIds,
  getInventoryByProductIds,
};
