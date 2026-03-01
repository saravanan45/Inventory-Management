export const getProducts = async (req, res) => {
  try {
    const products = await ProductsService.getProducts(req.body);
    return res.status(201).json(products);
  } catch (err) {
    console.error(err);
  }
};
