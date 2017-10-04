# Bamazon

### Overview

Created during Week 7 of Rutgers Coding Bootcamp. The challenge was to use Node JS and MySQL to create an Amazon-like storefront. 

The app takes in 3 different commands: bamazonCustomer, bamazonManager and bamazonSupervisor. 

- As the customer, the user can purchase products available for sale. 
- As the manager, the user can edit the products available for sale and adjust inventory levels. 
- As the supervisor, the user can track product sales across the store's departments and view profit by department. 
	
* All data will be logged to your terminal/bash window.

### Getting Started

- Clone down repo.
- Run command 'npm install' in Terminal or GitBash
- Run one of the commands listed below.

### What Each Command Does / Demonstration of Each Command

1. `node bamazonCustomer`

  	* All products available for sale will be displayed in a table along with their Product ID# and price
  	* As the customer, you have the ability to purchase a product by the Product ID#
  	* The customer inputs the Product ID# and number of units they would like to buy
  	* Then, a receipt prints to the console that totals the customer's purchase

	![customerdemo](assets/images/customerdemo.gif)

2. `node bamazonManager`

  	* You will be prompted with the following options:
  		* View Products for Sale - *Displays all products available for sale in a table*
  		* View Low Inventory - *Displays all products that have an inventory of less than 5 units*
  		* Add to Inventory - *Allows you to add inventory to any product available for sale*
  		* Add New Product - *Allows you to add a new product*
  		* Remove a Product - *Allows you to remove a product*
  		* Quit - *Exit the program*

	![managerdemo](assets/images/managerdemo.gif)

3. `node bamazonSupervisor`

	* You will be prompted with the following options:
		* View Product Sales by Department - *Displays overhead costs, product sales and total profit by department* 
		* Create New Department - *Allows you to create a new department in which the manager can then add products to*
		* Quit - *Exit the program* 

	![supervisordemo](assets/images/supervisordemo.gif)


### Tech used
- Node.js
- MySQL
- Inquirer NPM Package - https://www.npmjs.com/package/inquirer
- CLI-Table NPM Package - https://www.npmjs.com/package/cli-table


### Prerequisites
```
- Node.js - Download the latest version of Node https://nodejs.org/en/
```

### Built With

* Sublime Text - Text Editor

### Authors

* **Nicole Carvalho** - *Node JS MySQL* - [Nicole Carvalho](https://github.com/nicolelcarvalho)


