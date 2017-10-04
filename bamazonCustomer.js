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
  // run the placeOrder function after the connection is made to prompt the user
  productsForSale();
});


// Display all products available for sale 
function productsForSale() {
  // Require the table and create a header
  var Table = require('cli-table');
  var table = new Table({ head: ["Product ID #", "Product Name", "Price"] });

  // Run a query to select all data from the products table
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    console.log("\nProducts available for sale:");

    // Loop through the results of the query 
    for (var i = 0; i < results.length; i++) {
      var price = "$" + results[i].price;
      // Push the data needed into the table
      table.push([results[i].item_id, results[i].product_name, price]);
    }
    // Log the table to the console and execute the placeOrder function to allow the user to place an order
    console.log(table.toString());
    placeOrder();
  });
}


// Allow the user to place an order via a prompt
function placeOrder() {
  inquirer.prompt([
    {
      name: "choice",
      type: "input",
      message: "What is the ID # of the product that you would like to buy?",
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
      message: "How many would you like to buy?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
          return false;          
        }
    }

    ]).then(function(response) {

      // Run a query to select the data of the item_id in which the customers's response from question 1 is passed into
      // This will grab the customer's requested item id from the products table
      connection.query("SELECT * FROM products WHERE ?", { item_id: response.choice }, function(err, results) { 
        // Return the data and store into variables
        var itemOrdered = results[0].item_id;
        var unitsOrdered = response.units;
        var inventory = results[0].stock_quantity;
        var itemName = results[0].product_name;
        var itemCost = results[0].price;
        var totalCost = itemCost * unitsOrdered;      // Calculates the total that the customer ordered
        var totalCostRounded = totalCost.toFixed(2);  // This rounds it to the nearest 2 decimals
        var currentProductSales = results[0].product_sales; // Gets the current product sales of that item
        var addedProductSales = currentProductSales + totalCost; // Adds the total sales from the current order on to the current total sales of that item


      // If the inventory is greater than the units ordered by the customer, then we have enough in stock to fulfill the customer's order
        if(inventory > unitsOrdered) {
          // Calculate the remaining stock of the item and store it in a remainingStock variable
          var remainingStock = inventory - unitsOrdered;

          // Run a query to update the products table with the updated $ sales for that item (addedProductSales)
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                product_sales: addedProductSales
              },
              {
                item_id: itemOrdered
              }
            ],
            function(error) {
              if (error) throw error;
            }
          );

          // Run a query to update the products table with the new inventory level on the item that was ordered
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: remainingStock
              },
              {
                item_id: itemOrdered
              }
            ],
            function(error) {
              if (error) throw err;

              // Let the customer know that their order has been placed and show them their total
              console.log("\nYour order has been placed!" + "\n--------------------------" + "\nRECEIPT:\n" 
                          + "\nItem: " + itemName + "\nQty: " + unitsOrdered + " @ $" + itemCost + "/each" 
                          + "\n--------------------------" + "\nYour Total: " + "$" + totalCostRounded + "\n--------------------------");

              // Then, prompt the customer if they would like to place another order
              inquirer.prompt([
                  {
                    name: "anotherOrder",
                    type: "list",
                    message: "Would you like to place another order?",
                    choices: ["Yes", "No"]
                  }

              ]).then(function(response) {
                // If the customer selects yes, then execute the productsForSale function
                if(response.anotherOrder === "Yes") {
                  productsForSale();
                // If the customer selects no, then log a message and end the connection
                } else {
                  console.log("Thanks for shopping with Bamazon! Have a great day!");
                  connection.end();
                }
              });
            }
          );
        }

      // Else notify the customer that there isn't enough stock and give them the option to place another order
        else {
            inquirer.prompt([
              {
                name: "anotherOrder",
                type: "list",
                message: "We're sorry, we do not have enough in stock. Would you like to place a different order?",
                choices: ["Yes", "No"]
              }

            ]).then(function(response) {
              if(response.anotherOrder === "Yes") {
                productsForSale();
              } else {
                console.log("We're sorry we couldn't fulfill your order! Have a great day!");
                connection.end();
              }
            });
          }

      });
  });
}

