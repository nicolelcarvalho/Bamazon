DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INTEGER(15) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30),
	department_name VARCHAR(30),
	price decimal(100,2),
	stock_quantity INTEGER(100),
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Echo', 'Electronics', 100.00, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Kindle', 'Electronics', 80.99, 70);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Bluetooth Headphones', 'Electronics', 30.50, 60);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('iPhone Charger', 'Electronics', 35.00, 80);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Paper Towels', 'Kitchen', 19.99, 70);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Brita Filters', 'Kitchen', 15.75, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Toaster', 'Kitchen', 59.99, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Shower Curtain', 'Bath', 24.99, 60);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Shower Head', 'Bath', 29.99, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Electric Toothbrush', 'Bath', 99.99, 40);