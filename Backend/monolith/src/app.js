const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");
const LeakyBucket = require("./Common/LeakyBucket");

const routes = require("./routes");

const app = express();
app.use(cors());

const leakyBucket = new LeakyBucket(100, 10); // 100 requests per second
app.use(express.json());

const swaggerDocument = YAML.load("./src/openapi.yaml");

const swaggerOptions = {
  swaggerDefinition: swaggerDocument,
  apis: ["./src/routes.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  }),
);

app.use((req, res, next) => {
  if (leakyBucket.addRequest(req)) {
    next();
  } else {
    res.status(429).json({ error: "Too Many Requests" });
  }
});

app.use(routes);

module.exports = app;
