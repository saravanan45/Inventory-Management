const pool = require('../db');

const getInventoryByProductIds = async (client,productIds) => {
    try {
        const result = await client.query("SELECT * FROM inventory WHERE product_id = ANY($1) FOR UPDATE", [productIds]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching inventory');
    }
};

const updateInventoryForProductIds = (client, items, action) => {
    const updateQuery = action === 'release'
        ? `
            UPDATE inventory
            SET reserved_quantity = reserved_quantity - $1
            WHERE product_id = $2
        `
        : `
            UPDATE inventory
            SET reserved_quantity = reserved_quantity + $1
            WHERE product_id = $2
        `;

    const promises = items.map(item => {
        return client.query(updateQuery, [item.quantity, item.product_id]);
    });

    return Promise.all(promises);
};

module.exports = {
    getInventoryByProductIds,
    updateInventoryForProductIds
};