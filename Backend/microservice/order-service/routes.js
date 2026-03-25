const express = require('express');
const router = express.Router();
const OrdersController = require('./src/controllers/OrdersController');

// Order routes
router.get("/orders", OrdersController.getOrders);
router.get("/order/:id", OrdersController.getOrderById);
router.post("/order", OrdersController.createOrder);
router.put("/order", OrdersController.updateOrderStatus);
router.delete("/order/:id", OrdersController.deleteOrder);