const InventoryService = require('../services/InventoryService');
const response = require('../../../../Common/APIResponses');

const getInventoryByProductIds = async (req, res) => {
    const { ids } = req.body;
    if(!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(response.error("Invalid request body: 'ids' must be a non-empty array"));
    }
    try {
        const inventory = await InventoryService.getInventoryByProductIds(ids);
        return res.status(200).json(response.success(inventory));
    } catch (err) {
        console.error(err);
        return res.status(500).json(response.error("Internal Server Error"));
    }
};

const updateInventoryForProductIds = async (req, res) => {
  const { items } = req.body;
  if(!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json(response.error("Invalid request body: 'items' must be a non-empty array"));
  }
  try {
    // update inventory - increment reserved quantity for each product in the order
    await InventoryService.updateInventoryForProductIds(items);
    return res.status(200).json(response.success("Inventory updated successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(response.error("Error updating inventory"));
  }
};

module.exports = {
    getInventoryByProductIds,
    updateInventoryForProductIds,
};