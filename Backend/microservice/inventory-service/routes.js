const express = require('express');
const router = express.Router();
const InventoryController = require('./src/controllers/InventoryController');


router.get('/inventory/:sku', InventoryController.getInventoryBySKU);
router.post('/inventory', InventoryController.createInventory);
router.put('/inventory', InventoryController.updateInventory);
router.delete('/inventory/:sku', InventoryController.deleteInventory);