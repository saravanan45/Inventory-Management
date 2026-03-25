# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


Application structure

Frontend -> User Application -> list of products -> react-query -> fetch

place order -> item -> react-query

Backend -> place-order -> Order service -> Inventory Service for item quantity check 

swagger URL: http://localhost:3010/api-docs/

Backend URL: http://localhost:3010/


Backend DB SQL Queries

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    category_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
	id BIGSERIAL PRIMARY KEY,
	order_id BIGINT NOT NULL REFERENCES orders(id) on DELETE CASCADE,
	product_id BIGINT NOT NULL REFERENCES products(id),
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	price_at_purchase NUMERIC(12,2) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_product_warehouse
        UNIQUE (product_id, warehouse_id)
);

INSERT INTO products (
    name,
    sku,
    description,
    price,
    currency,
    category_id,
    is_active
)
SELECT
    'Product ' || gs AS name,
    'SKU-' || LPAD(gs::text, 4, '0') AS sku,
    'Description for product ' || gs,
    ROUND((random() * 10000 + 100)::numeric, 2) AS price,
    'INR',
    NULL,
    TRUE
FROM generate_series(1, 100) AS gs;


INSERT INTO inventory (
    product_id,
    warehouse_id,
    available_quantity,
    reserved_quantity
)
SELECT
    id,
    1 AS warehouse_id,
    FLOOR(random() * 200)::int AS available_quantity,
    FLOOR(random() * 50)::int AS reserved_quantity
FROM products
LIMIT 100;

INSERT INTO orders (
    user_id,
    total_amount,
    currency,
    status,
    payment_status,
    created_at,
    updated_at
)
SELECT
    FLOOR(random() * 50 + 1)::bigint AS user_id,
    ROUND((random() * 20000 + 500)::numeric, 2) AS total_amount,
    'INR',
    (ARRAY['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'])
        [FLOOR(random()*5 + 1)],
    (ARRAY['UNPAID','PAID','FAILED','REFUNDED'])
        [FLOOR(random()*4 + 1)],
    NOW() - (random() * interval '30 days'),
    NOW()
FROM generate_series(1, 100);


INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price_at_purchase
)
SELECT
    FLOOR(RANDOM() * 100 + 1)::BIGINT AS order_id,  -- 1 to 100
    FLOOR(RANDOM() * 50 + 1)::BIGINT AS product_id, -- assuming products 1–50 exist
    FLOOR(RANDOM() * 5 + 1)::INT AS quantity,       -- 1 to 5 quantity
    ROUND((RANDOM() * 1000 + 100)::NUMERIC, 2) AS price_at_purchase
FROM generate_series(1, 500);

ALTER TABLE order_items RENAME COLUMN products_id TO product_id;

// DB Connection

host: 127.0.0.1
user saravanan
password admin 
database postgres
port 5432


// DB orders insert query

{
  "user_id": 101,
  "total_amount": 200,
  "status": "PENDING",
  "payment_status": "PAID",
  "currency": "INR",
  "items": [
    {
      "product_id": "13",
      "quantity": "2",
      "price_at_purchase": "50"
    }
  ]
}

// postgres cli

docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=saravanan \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql \
  postgres

docker exec -it postgres-db psql -U saravanan -d postgres

// docker exec -it 'docker-container-name' psql -U 'user' -d 'db-name'


// For microservice

create database inventory_db;
create database order_db;

docker exec -it postgres-db psql -U saravanan -d inventory_db // for (use inventory_db)

// Inventory_db table creation

CREATE TABLE inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (product_id, warehouse_id)
);

INSERT INTO inventory (
    product_id,
    warehouse_id,
    available_quantity,
    reserved_quantity
)
SELECT
    gs.id AS product_id,
    1 AS warehouse_id,
    FLOOR(random() * 200)::int AS available_quantity,
    FLOOR(random() * 50)::int AS reserved_quantity
FROM generate_series(1, 100) AS gs(id);
