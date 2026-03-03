const OrdersRepository = require('../Repository/OrdersRepository');
const InventoryRepository = require('../Repository/InventoryRepository');
const pool = require('../db');

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

        const productIds = items.map(item => item.product_id);
        const itemMap = new Map(items.map(i => [i.product_id, i]));
        // inventory check - fetch inventory for all products in the order and validate availability
        const inventoryProducts = await InventoryRepository.getInventoryByProductIds(client, productIds);

        // validate all products in the order exist in inventory
        if(inventoryProducts.length !== productIds.length) {
            throw new Error('One or more products not found in inventory');
        }

        // validate stock availability for each product in the order
        for (const item of inventoryProducts) {
            const available_quantity = item.available_quantity - item.reserved_quantity;
            const orderedItem = itemMap.get(item.product_id);
            if (available_quantity < orderedItem.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.product_id}`);
            }
        }

        // create order
        const order = await OrdersRepository.createOrder(client,data);
        // update inventory - increment reserved quantity for each product in the order
        await InventoryRepository.updateInventoryForProductIds(client, items);
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