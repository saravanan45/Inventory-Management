const inventoryHost = process.env.INVENTORY_HOST || "localhost";
const inventoryPort = process.env.INVENTORY_PORT || 3001;

module.exports = {
  inventoryHost,
  inventoryPort,
};