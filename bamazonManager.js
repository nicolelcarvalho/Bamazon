var mysql = require("mysql");
var inquirer = require("inquirer");

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


function productsForSale() {
	console.log("\nProducts for sale: "); 
	connection.query("SELECT * FROM products", function(err, results) { 
		for (var i = 0; i < results.length; i++) {

	console.log("\nProduct ID #: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nDepartment: " 
							+ results[i].department_name + "\nPrice: $" + results[i].price + "\nInventory: " + results[i].stock_quantity + " units");
	}
	console.log("\n-----------------------------------------");
	listMenu();
	});
}


function viewLowInventory() {
	connection.query("SELECT * FROM products", function(err, results) { 
		console.log("\nProducts with low inventory of less than 5 units:");

		for (var i = 0; i < results.length; i++) {
			if (results[i].stock_quantity < 5) { 
				console.log("\nProduct ID#: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nCurrent Inventory: " + results[i].stock_quantity);
				}
			}
		console.log("\n-----------------------------------------");
		listMenu();
		});
  }


function addToInventory() {
  connection.query("SELECT * FROM products", function(err, results) { 

		for (var i = 0; i < results.length; i++) {
		console.log("\nProduct ID #: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nDepartment: " 
								+ results[i].department_name + "\nPrice: $" + results[i].price + "\nInventory: " + results[i].stock_quantity + " units");
		}
		console.log("\n-----------------------------------------");

	// Prompt what product ID you'd like to add units to 
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

      connection.query("SELECT * FROM products WHERE ?", { item_id: selection.productID }, function(err, results) { 	

   		var itemName = results[0].product_name;
   		var itemID = selection.productID;
   		var currentInventory = parseInt(results[0].stock_quantity);
   		var addedInventory = parseInt(selection.units);
   		var newInventory = addedInventory + currentInventory;

     	console.log("\nManager selected product ID#: " + itemID);
     	console.log("Product Name: " + itemName);
   		console.log("Current inventory: " + currentInventory);
   		console.log("Number of units to add: " + addedInventory);
   		console.log("New Inventory: " + newInventory);

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

    	console.log("Manager would like to add: " + newProduct.name);
    	console.log("Department: " + newProduct.department);
    	console.log("Price: " + newProduct.price);
    	console.log("Inventory: " + newProduct.inventory);

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


function removeProduct() {
	connection.query("SELECT * FROM products", function(err, results) { 

	for (var i = 0; i < results.length; i++) {
		console.log("\nProduct ID #: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nDepartment: " 
							+ results[i].department_name + "\nPrice: $" + results[i].price + "\nInventory: " + results[i].stock_quantity + " units");
		}
		console.log("\n-----------------------------------------");

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


