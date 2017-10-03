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
  // run the placeOrder function after the connection is made to prompt the user
  placeOrder();
});

function placeOrder() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log("\nProducts available for sale:");
    for (var i = 0; i < results.length; i++) {
      console.log("\nProduct Name: " + results[i].product_name + "\nPrice: $" + results[i].price + "\nProduct ID #: " + results[i].item_id + "\nQty Available: " + results[i].stock_quantity);
    }
    console.log("\n-----------------------------------------");
    askQuestion();
  });
}


function askQuestion () {
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

      connection.query("SELECT * FROM products WHERE ?", { item_id: response.choice }, function(err, results) { 
        
        var itemOrdered = results[0].item_id;
        var unitsOrdered = response.units;
        var inventory = results[0].stock_quantity;
        var itemName = results[0].product_name;
        var itemCost = results[0].price;
        var totalCost = itemCost * unitsOrdered;
        var totalCostRounded = totalCost.toFixed(2);

        if(inventory > unitsOrdered) {
          var remainingStock = inventory - unitsOrdered;
          console.log("Remaining Units in Stock: " + remainingStock);

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

              console.log("\nYour order has been placed!" + "\n--------------------------" + "\nRECEIPT:\n" 
                          + "\nItem: " + itemName + "\nQty: " + unitsOrdered + " @ $" + itemCost + "/each" 
                          + "\n--------------------------" + "\nYour Total: " + "$" + totalCostRounded + "\n--------------------------");

              inquirer.prompt([
                  {
                    name: "anotherOrder",
                    type: "list",
                    message: "Would you like to place another order?",
                    choices: ["Yes", "No"]
                  }

              ]).then(function(response) {
                if(response.anotherOrder === "Yes") {
                  placeOrder();
                } else {
                  console.log("Thanks for shopping with Bamazon! Have a great day!");
                  connection.end();
                }
              });
            }
          );
        }

        else {
         // Else notify the customer that there isn't enough stock and give them the option to place another order
            inquirer.prompt([
              {
                name: "anotherOrder",
                type: "list",
                message: "We're sorry, we do not have enough in stock. Would you like to place a different order?",
                choices: ["Yes", "No"]
              }

            ]).then(function(response) {
              if(response.anotherOrder === "Yes") {
                placeOrder();
              } else {
                console.log("We're sorry we couldn't fulfill your order! Have a great day!");
                connection.end();
              }
            });
        }

      });
  });
}

