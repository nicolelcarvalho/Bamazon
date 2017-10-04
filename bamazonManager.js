var mysql = require("mysql");        // Allows us to grab information from a database we create in mysql 
var inquirer = require("inquirer");  // Allows us to use prompts via the console
var Table = require("cli-table");    // Allows us to log information in a table format

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the listMenu function after the connection is made to prompt the user
  listMenu();
});


// Allow the manager to select from a list of options and execute the respective function based on the manager's answer
function listMenu() {
  inquirer.prompt([
    {
     name: "menu",
     type: "list",
     message: "Hello Bamazon Manager! What would you like to do?",
     choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Remove a Product", "Quit"]
    }

   ]).then(function(selection) {

   	switch(selection.menu) {
   		case "View Products for Sale":
   			productsForSale();
   			break;

   		case "View Low Inventory":
   			viewLowInventory();
   			break;

   		case "Add to Inventory":
   			addToInventory();
   			break;

   		case "Add New Product":
   			addNewProduct();
   			break;

   		case "Remove a Product":
   			removeProduct();
   			break;

   		case "Quit":
   			quit();
   			break;
   	}
});
}


// List all of the products available for sale
function productsForSale() {
	console.log("\nProducts for sale: "); 

// Require the table and create a header
	var Table = require('cli-table');
	var table = new Table({ head: ["Product ID #", "Product Name", "Department Name", "Price", "Inventory"] });

	// Run a query that selects all products from the products table
	connection.query("SELECT * FROM products", function(err, results) {
		// Loop through the results
		for (var i = 0; i < results.length; i++) {
			var inventory = results[i].stock_quantity + " units";
			var price = "$" + results[i].price;
			// Push the results into a table
			table.push([results[i].item_id, results[i].product_name, results[i].department_name, price, inventory]);
		}
		// Log the table to the console and execute listMenu again
		console.log(table.toString());
		listMenu();
	});
}


// View products with an inventory of less than 5 units
function viewLowInventory() {
	console.log("\nProducts with low inventory of less than 5 units:");

	// Require the table and create a header
	var Table = require('cli-table');
	var table = new Table({ head: ["Product ID #", "Product Name", "Department Name", "Price", "Inventory"] });

	// Run a query that selects all of the data in the products table
	connection.query("SELECT * FROM products", function(err, results) { 
		// Loop through the results
		for (var i = 0; i < results.length; i++) {
			// If the stock_quantity on any of the results is less than 5
			if (results[i].stock_quantity < 5) { 
					var inventory = results[i].stock_quantity + " units (LOW)";
					var price = "$" + results[i].price;
					// Push the relative data into the table
					table.push([results[i].item_id, results[i].product_name, results[i].department_name, price, inventory]);
				}
			}
		// Log the table to the console and execute listMenu again
		console.log(table.toString());
		listMenu();
		});
  }


// Allow the manager to add to inventory 
function addToInventory() {

	// First, we display the table of all products
	// Require the table and create a header
	console.log("\nCurrent Inventory:");
	var Table = require('cli-table');
	var table = new Table({ head: ["Product ID #", "Product Name", "Department Name", "Price", "Inventory"] });

	// Run a query that selects all of the data in the products table
  connection.query("SELECT * FROM products", function(err, results) { 
  	// Loop through the results
		for (var i = 0; i < results.length; i++) {
			var inventory = results[i].stock_quantity + " units";
			var price = "$" + results[i].price;
			// Push the relative date into a table
			table.push([results[i].item_id, results[i].product_name, results[i].department_name, price, inventory]);
		}
		// Log the table to the console 
		console.log(table.toString());

	// Then, we prompt the manager to see what product ID they'd like to add units to 
  inquirer.prompt([
    {
     name: "productID",
     type: "input",
     message: "Please enter the Product ID # for the item you'd like to add inventory to.",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    },
    {
     name: "units",
     type: "input",
     message: "How many units would you like to add?",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    }
   ]).then(function(selection) {

   		// Run a query that targets the item_id that the manager wants to update. Retrieve data from that item.
      connection.query("SELECT * FROM products WHERE ?", { item_id: selection.productID }, function(err, results) { 	
      // Store data in variables.
   		var itemName = results[0].product_name;
   		var itemID = selection.productID;
   		var currentInventory = parseInt(results[0].stock_quantity);
   		var addedInventory = parseInt(selection.units);
   		var newInventory = addedInventory + currentInventory;

   		// Log messages to let the manager know the item that has been selected, the current data of that item and the updated inventory of that item
     	console.log("\nManager selected product ID#: " + itemID);
     	console.log("Product Name: " + itemName);
   		console.log("Current inventory: " + currentInventory);
   		console.log("Number of units to add: " + addedInventory);
   		console.log("New Inventory: " + newInventory);

   		// Run a query to update the item with the new inventory that the manager requested to add plus the current inventory
			connection.query("UPDATE products SET ? WHERE ?", 
				[
					{
						stock_quantity: newInventory
					},
					{
						item_id: itemID
					}
				],
				function(err, results) { 
					if (err) throw err;
					console.log("\nInventory added successfully!");
					console.log("\n-----------------------------------------");
					listMenu();
				}
			);
		});
	});
});
}


// Allow the manager to add a new product into the products table
function addNewProduct() {
// Name of the item, department name, price, inventory level
  inquirer.prompt([
    {
     name: "name",
     type: "input",
     message: "What is the name of the product you would like to add?"
    },
    {
     name: "department",
     type: "input",
     message: "What department will it be in?"
    },
    {
     name: "price",
     type: "input",
     message: "What is the price of the product? (Please enter in this format: 00.00)",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    },
    {
     name: "inventory",
     type: "input",
     message: "How many units are in stock of this item?",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    }
    ]).then(function(newProduct) {

    	// Log messages to sum up what the manager would like to add
    	console.log("Manager would like to add: " + newProduct.name);
    	console.log("Department: " + newProduct.department);
    	console.log("Price: " + newProduct.price);
    	console.log("Inventory: " + newProduct.inventory);

    	// Insert the manager's responses into the products table
    	connection.query(
    		"INSERT INTO products SET ?",
    		{
    			product_name: newProduct.name,
    			department_name: newProduct.department,
    			price: newProduct.price,
    			stock_quantity: newProduct.inventory
    		},
    		function(err) {
    			if (err) throw err;
    			console.log("Product added successfully!");
    			listMenu();
    		}
    	);
    });
}


// Allow the manager to remove a product from the products table
function removeProduct() {

	// Show all products for sale in a table
	console.log("\nProducts For Sale:");
	var Table = require('cli-table');
	var table = new Table({ head: ["Product ID #", "Product Name", "Department Name", "Price", "Inventory"] });

	connection.query("SELECT * FROM products", function(err, results) { 

	for (var i = 0; i < results.length; i++) {
			var inventory = results[i].stock_quantity + " units";
			var price = "$" + results[i].price;

			table.push([results[i].item_id, results[i].product_name, results[i].department_name, price, inventory]);
		}

		console.log(table.toString());

  inquirer.prompt([
    {
     name: "id",
     type: "input",
     message: "What is the ID of the product you would like to delete?",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    }
    ]).then(function(select) { 

    	// Run a query to delete the product the manager has requested
			connection.query(
				"DELETE FROM products WHERE ?",
				{
					item_id: select.id
				},
				function(err, res) {
					console.log(res.affectedRows + " product deleted!");
					listMenu();
				}
			);
	})
 });
}


function quit() {
	console.log("Have a great day!");
	connection.end();
}


