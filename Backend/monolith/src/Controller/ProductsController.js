const ProductsService = require("../Service/ProductsService");
const response = require("../Common/APIResponses");

const getProducts = async (req, res) => {
  const { page = 0, limit = 10 } = req.query || {};
  try {
    const products = await ProductsService.getProducts(page, limit);
    const successJSON = response.success(products);
    return res.status(200).json(successJSON);
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const getProductBySKU = async (req, res) => {
  const { sku } = req.params;
  if (!sku) return res.status(400).json({ error: "SKU is required" });
  try {
    const product = await ProductsService.getProductBySKU(sku);
    if (!product) return res.status(404).json(response.error("Product not found"));
    return res.status(200).json(response.success(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const createProduct = async (req, res) => {
  const { sku, price, name, is_active } = req.body;
  if (!sku) return res.status(400).json({ error: "SKU is required" });
  if (!price) return res.status(400).json({ error: "Price is required" });
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (is_active === undefined) return res.status(400).json({ error: "is_active is required" });
  try {
    const product = await ProductsService.createProduct(req.body);
    return res.status(201).json(response.success(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const updateProduct = async (req, res) => {
  const { sku } = req.body;
  if (!sku) return res.status(400).json({ error: "SKU is required" });
  try {
    const product = await ProductsService.updateProduct(req.body);
    return res.status(200).json(response.success(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

const deleteProduct = async (req, res) => {
  const { sku } = req.params;
  if (!sku) return res.status(400).json({ error: "SKU is required" });
  try {
    const product = await ProductsService.deleteProduct(sku);
    return res.status(200).json(response.success(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json(response.error("Internal Server Error"));
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySKU,
};
