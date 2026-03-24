const ProductsRepository = require('../Repository/ProductsRepository');

const getProducts = async (page, limit) => {
    try {
        const products = await ProductsRepository.getProducts(page, limit);
        return products;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching products');
    }
};

const getProductBySKU = async (sku) => {
    try {
        const product = await ProductsRepository.getProductBySKU(sku);
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching product by SKU');
    }
};

const createProduct = async (data) => {
    try {
        const product = await ProductsRepository.createProduct(data);
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating product');
    }
};

const updateProduct = async (data) => {
    try {
        const product = await ProductsRepository.updateProduct(data);
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating product');
    }
};

const deleteProduct = async (sku) => {
    try {
        const product = await ProductsRepository.deleteProduct(sku);
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting product');
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductBySKU,
};
