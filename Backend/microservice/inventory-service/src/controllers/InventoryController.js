const InventoryService = require('../services/InventoryService');
const response = require('../../../../Common/APIResponses');

const getInventoryByProductIds = async (req, res) => {
    const { ids } = req.body;
    try {
        const inventory = await InventoryService.getInventoryByProductIds(ids);
        return res.status(200).json(response.success(inventory));
    } catch (err) {
        console.error(err);
        return res.status(500).json(response.error("Internal Server Error"));
    }
};

const updateInventoryForProductIds = async (req, res) => {
  try {
    // update inventory - increment reserved quantity for each product in the order
    await InventoryService.updateInventoryForProductIds(req.body.items);
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