const pool = require('../../db');

const getInventoryByProductIds = async (client,productIds) => {
    try {
        const result = await client.query("SELECT * FROM inventory WHERE product_id = ANY($1) FOR UPDATE", [productIds]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching inventory');
    }
};

const updateInventoryForProductIds = (client, items) => {
    const flatValues = items.flatMap(item => [item.product_id, item.quantity]);
    const valuePlaceholders = items.map((_, index) => `($${index * 2 + 1}::bigint, $${index * 2 + 2}::integer)`).join(', ');

    const query = `
        UPDATE inventory AS i
        SET reserved_quantity = i.reserved_quantity + c.quantity
        FROM (VALUES ${valuePlaceholders}) AS c(product_id, quantity)
        WHERE i.product_id = c.product_id
    `;

    return client.query(query, flatValues);
}

module.exports = {
    getInventoryByProductIds,
    updateInventoryForProductIds
};