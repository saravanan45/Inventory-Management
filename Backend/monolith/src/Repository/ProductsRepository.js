const pool = require("../db");

const getProducts = async (page, limit) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, page * limit],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching products");
  }
};

const getProductBySKU = async (sku) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE sku = $1", [
      sku,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching product by SKU");
  }
}

const createProduct = async (data) => {
  try {
    const result = await pool.query(
      "INSERT INTO products (name, sku, description, price, currency, category_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        data.name,
        data.sku,
        data.description,
        data.price,
        data.currency,
        data.category_id,
        data.is_active,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error creating product");
  }
};

const updateProduct = async (data) => {
  try {
    const result = await pool.query(
      "UPDATE products SET price = $1 WHERE sku = $2 RETURNING *",
      [data.price, data.sku],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error updating product");
  }
};

const deleteProduct = async (sku) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE sku = $1 RETURNING *",
      [sku],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting product");
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySKU,
};
