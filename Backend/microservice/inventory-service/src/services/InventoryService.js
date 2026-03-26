const InventoryRepository = require('../repository/InventoryRepository');

const updateInventoryForProductIds = async (items) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
   const response = await InventoryRepository.updateInventoryForProductIds(items);
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

module.exports = {
  updateInventoryForProductIds,
  getInventoryByProductIds,
};
