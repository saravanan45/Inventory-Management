const OrdersRepository = require('../repository/OrdersRepository');
const pool = require('../../db');

const getOrders = async (page, limit) => {
    try { 
        const orders = await OrdersRepository.getOrders(page, limit);
        return orders;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching orders');
    }
};

const getOrderById = async (id) => {
    try {
        const order = await OrdersRepository.getOrderById(id);
        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching order by ID');
    }
};

const createOrder = async (data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { items } = data;
        // extract product IDs from order items
        const productIds = items.map(item => item.product_id);
        // create a map of order items for quick lookup
        const itemMap = new Map(items.map(i => [i.product_id, i]));
        // inventory check - fetch inventory for all products in the order and validate availability
        // const inventoryProducts = await getInventoryByProductIds(client, productIds);

        // validate all products in the order exist in inventory
        if(inventoryProducts.length !== productIds.length) {
            throw new Error('One or more products not found in inventory');
        }

        // validate stock availability for each product in the order
        // if(!validateStockAvailability(inventoryProducts, itemMap)) {
        //     throw new Error(`Insufficient stock for one or more products in the order`);
        // }

        // create order
        const order = await OrdersRepository.createOrder(client,data);
        // update inventory - decrement reserved quantity for each product in the order
        await updateInventoryForProductIds(client, items);
        // return created order
        await client.query('COMMIT');
        return order;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        throw error instanceof Error ? error : new Error('Error creating order');
    } finally {
        client.release();
    }
};

const updateOrder = async (data) => {
    try {
        const order = await OrdersRepository.updateOrder(data);
        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating order');
    }
};

const deleteOrder = async (id) => {
    try {
        const order = await OrdersRepository.deleteOrder(id);
        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting order');
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
};