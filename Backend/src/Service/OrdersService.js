const OrdersRepository = require('../Repository/OrdersRepository');

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
    try {
        const order = await OrdersRepository.createOrder(data);
        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating order');
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