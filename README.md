# Bamazon

### Overview

Created during Week 7 of Rutgers Coding Bootcamp. The challenge was to use Node JS and MySQL to create an Amazon-like storefront. 

Node JS was used to create the backend of this application which is accessed through the terminal. All data will be logged to your terminal/bash window.

MySQL was used to create a database to store product information such as product name, price, inventory, etc. As the application is used and products are being purchased or inventory levels are being adjusted, the data is updated in the MySQL database. 

The app takes in 3 different commands: bamazonCustomer, bamazonManager and bamazonSupervisor. 

- As the customer, the user can purchase products available for sale. 
- As the manager, the user can edit the products available for sale and adjust inventory levels. 
- As the supervisor, the user can track product sales across the store's departments and view profit by department. 

### Getting Started

- Clone down repo.
- Run command 'npm install' in Terminal or GitBash
- Run one of the commands listed below.

### What Each Command Does / Demonstration of Each Command

1. `node bamazonCustomer`

  	* All products available for sale will be displayed in a table along with their product ID# and price
  	* As the customer, you have the ability to purchase a product by the product ID#
  	* The customer inputs the product ID# and number of units they would like to buy
  	* Then, a receipt prints to the console that totals the customer's purchase

	![customerdemo](assets/images/customerdemo.gif)

2. `node bamazonManager`

  	* You will be prompted with the following options:
  		* View Products for Sale 
  		* View Low Inventory - *Displays all products that have an inventory of less than 5 units*
  		* Add to Inventory 
  		* Add New Product 
  		* Remove a Product 
  		* Quit 

	![managerdemo](assets/images/managerdemo.gif)

3. `node bamazonSupervisor`

	* You will be prompted with the following options:
		* View Product Sales by Department - *Displays overhead costs, product sales and total profit by department* 
		* Create New Department 
		* Quit 

	![supervisordemo](assets/images/supervisordemo.gif)


## MySQL Snapshots

1. Creating the products table and inserting data. 
	
	* A Product sales column is created in MySQL but it is calculated within the bamazonCustomer.js file and adds to the appropriate item's product sales column after every purchase.

   ![createProductsTable](assets/images/createProductsTable.png)

2. Creating the departments table and inserting data
   
   	![createDepartmentsTable](assets/images/createDepartmentsTable.png)

3. Joining the products table & departments table by department Name and summing product sales by department. 

	* Profit by department is calculated on the fly in the bamazonSupervisor.js file and is not stored in MySQL as per the instructions in the assignment.

	![joinTables](assets/images/joinTables.png)



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

* **Nicole Carvalho** - *Node JS, MySQL* - [Nicole Carvalho](https://github.com/nicolelcarvalho)


