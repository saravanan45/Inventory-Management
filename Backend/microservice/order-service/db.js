const { Pool } = require("pg");

const pool = new Pool({
  user: "saravanan",
  host: "localhost",
  database: "order_db",
  password: "admin",
  port: 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected to order_db");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

module.exports = pool; 