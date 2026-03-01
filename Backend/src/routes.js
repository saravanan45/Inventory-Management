const express = require('express')
const pool = require('./db.js')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

// Products Routes
router.get('/products', ProductsController.getProducts)
router.post('/product', ProductsController.createProduct)
router.put('/product', ProductsController.updateProduct)
router.delete('/product', ProductsController.deleteProduct)


// Order Routes
router.get('/orders', OrdersController.getOrders)
router.post('/order', OrdersController.createOrder)
router.put('/updateOrder', OrdersController.updateOrder)
router.delete('/order', OrdersController.deleteOrder)


module.exports = router