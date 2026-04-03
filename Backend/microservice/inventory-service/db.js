const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "saravanan",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "inventory_db",
  password: process.env.DB_PASSWORD || "admin",
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected to inventory_db");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

module.exports = pool; 