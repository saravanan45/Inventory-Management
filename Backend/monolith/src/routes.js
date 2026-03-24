const express = require("express");
const pool = require("./db.js");
const ProductsController = require("./Controller/ProductsController");
const OrdersController = require("./Controller/OrdersController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Product routes
router.get("/products", ProductsController.getProducts);
router.get("/product/:sku", ProductsController.getProductBySKU);
router.post("/product", ProductsController.createProduct);
router.put("/product", ProductsController.updateProduct);
router.delete("/product/:sku", ProductsController.deleteProduct);

// Order routes
router.get("/orders", OrdersController.getOrders);
router.get("/order/:id", OrdersController.getOrderById);
router.post("/order", OrdersController.createOrder);
router.put("/order", OrdersController.updateOrderStatus);
router.delete("/order/:id", OrdersController.deleteOrder);

module.exports = router;
