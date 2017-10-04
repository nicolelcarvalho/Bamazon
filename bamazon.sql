DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

--> Products Table
CREATE TABLE products(
	item_id INTEGER(15) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30),
	department_name VARCHAR(30),
	price DECIMAL(50,2),
	stock_quantity INTEGER(100),
	product_sales DECIMAL(50,2) DEFAULT 0,
	PRIMARY KEY (item_id)
);

--> Items being inserted into the Products Table
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Amazon Echo', 'Electronics', 129.99, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Kindle', 'Electronics', 80.99, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Bluetooth Headphones', 'Electronics', 32.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('iPhone Charger', 'Electronics', 34.99, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Paper Towels', 'Kitchen', 19.99, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Brita Filters', 'Kitchen', 15.75, 7);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Toaster', 'Kitchen', 59.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Shower Curtain', 'Bath', 24.99, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Shower Head', 'Bath', 29.99, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Electric Toothbrush', 'Bath', 99.99, 3);


--> Departments Table
CREATE TABLE departments(
	department_id INTEGER(50) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(30),
	over_head_costs DECIMAL(50,2),
	PRIMARY KEY (department_id)
);

--> Items being inserted into the Departments Table
INSERT INTO departments (department_name, over_head_costs) values ('Electronics', 1200);
INSERT INTO departments (department_name, over_head_costs) values ('Kitchen', 3000);
INSERT INTO departments (department_name, over_head_costs) values ('Bath', 2000);


--> Joining Tables by Left Join (Must also get the sum of product sales by department)
SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS 'department_sales'
FROM products p
LEFT JOIN departments d ON p.department_name=d.department_name
GROUP BY department_id;


