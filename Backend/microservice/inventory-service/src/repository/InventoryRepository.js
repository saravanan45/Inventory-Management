const getInventoryByProductIds = async (productIds, client) => {
    try {
        const result = await client.query("SELECT * FROM inventory WHERE product_id = ANY($1) FOR UPDATE", [productIds]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching inventory');
    }
};

const updateInventoryForProductIds = async (items, client) => {
    const flatValues = items.flatMap(item => [item.product_id, item.quantity]);
    const valuePlaceholders = items.map((_, index) => `($${index * 2 + 1}::bigint, $${index * 2 + 2}::integer)`).join(', ');

    const query = `
        UPDATE inventory AS i
        SET reserved_quantity = i.reserved_quantity + c.quantity
        FROM (VALUES ${valuePlaceholders}) AS c(product_id, quantity)
        WHERE i.product_id = c.product_id
    `;

    try {
        const result = await client.query(query, flatValues);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating inventory');
    }
};

const checkOrderIsAlreadyProcessed = async (id, client) => {
    try {
        const result = await client.query("SELECT 1 FROM processed_events WHERE event_id = $1", [id]);
        return result.rows.length > 0;
    } catch (error) {
        console.error(error);
        throw new Error("Error checking order status");
    }
};

const updateProcessedEvents = async (orderId, client) => {
    try {
        await client.query(
            "INSERT INTO processed_events (event_id, processed_at) VALUES ($1, NOW())",
            [orderId]
        );
    } catch (error) {
        console.error(error);
        throw new Error("Error updating processed events");
    }
};

module.exports = {
    getInventoryByProductIds,
    updateInventoryForProductIds,
    checkOrderIsAlreadyProcessed,
    updateProcessedEvents
};