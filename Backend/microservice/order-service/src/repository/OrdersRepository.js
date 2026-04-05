const pool = require("../../db");

const getOrders = async (page, limit) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, page * limit],
    );
    return orders.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching orders");
  }
};

const getOrderById = async (id) => {
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    const orderItems = await pool.query(
      "SELECT oi.*, p.name, p.sku FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
      [id],
    );
    order.rows[0].items = orderItems.rows;
    return order.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching order by ID");
  }
};  

const createOrder = async (data) => {
  try {
    const order = await pool.query(
      "INSERT INTO orders ( user_id, total_amount, currency, status, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        data.user_id,
        data.total_amount,
        data.currency,
        "PENDING",
        data.payment_status,
      ],
    );
    const orderId = order.rows[0].id;
     if (Array.isArray(data.items) && data.items.length > 0) {
      // Build a single bulk INSERT for order_items
      const values = [];
      const placeholders = data.items.map((item, idx) => {
        const base = idx * 4;
        // push parameters for this row: order_id, product_id, quantity, price_at_purchase
        values.push(orderId, item.product_id, item.quantity, item.price_at_purchase);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
      });

      const insertItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES ${placeholders.join(", ")}
      `;
      await pool.query(insertItemsQuery, values);
    }
    return order.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error creating order");
  }
};

const updateOrderStatus = async (data) => {
  try {
    const order = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [data.status, data.id],
    );
    return order.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating order");
  }
};

const deleteOrder = async (data) => {
  try {
    const order = pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [
      data.id,
    ]);
    return order.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting order");
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderById
};
