const express = require('express');
const router = express.Router();
const InventoryController = require('./src/controllers/InventoryController');


router.get('/', (req, res) => res.send('Inventory Service is running!'));
router.post('/inventoryByProductIds', InventoryController.getInventoryByProductIds);
router.put('/inventoryByProductIds/update', InventoryController.updateInventoryForProductIds);

module.exports = router;