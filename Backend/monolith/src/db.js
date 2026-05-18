const { Pool } = require("pg");

const pool = new Pool({
  user: "saravanan",
  host: "localhost",
  database: "postgres",
  password: "admin",
  port: 5440,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

module.exports = pool; 