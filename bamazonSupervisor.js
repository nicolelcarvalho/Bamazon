var mysql = require("mysql");       // Allows us to grab information from a database we create in mysql 
var inquirer = require("inquirer"); // Allows us to use prompts via the console
var Table = require("cli-table");   // Allows us to log information in a table format

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

// Prompt the user with a menu that allows them to select View Products Sales by Dept or Create a New Dept
function listMenu() {
  inquirer.prompt([
    {
     name: "menu",
     type: "list",
     message: "Hello Bamazon Supervisor! What would you like to do?",
     choices: ["View Product Sales by Department", "Create New Department", "Quit"]
    }

   ]).then(function(user) {

   	switch(user.menu) {
   		// If the user selects the first option, then execute the productSalesDept function
   		case "View Product Sales by Department":
   			productSalesDept();
   			break;

 			// If the user selects the second option, then excute the createNewDept function
   		case "Create New Department":
   			createNewDept();
   			break;
   		// If the user selects "quit" then execute the quit function
   		case "Quit":
   			quit();
   			break;
   	}
	});
}


// View Product Sales by Dept
// Grabs the data from mysql through the query.
function productSalesDept() {

// Require the table and create a header
var Table = require('cli-table');
var table = new Table({ head: ["Department ID #", "Department Name", "Over Head Costs", "Department Sales", "Total Profit"] });

// Run a query to join the products and departments tables. Joins products and departments tables via left join while summing up product sales by dept.
connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS 'department_sales'" 
								+ "FROM products p LEFT JOIN departments d ON p.department_name=d.department_name GROUP BY department_id;", function(err, res) {

	// Loop through the results returned from the query and store the needed results in variables. 
	for (var i = 0; i < res.length; i++) {
		var departmentID = res[i].department_id;
		var departmentName = res[i].department_name;
		var overhead = parseInt(res[i].over_head_costs);
		var deptSales = parseInt(res[i].department_sales);
		var profit = deptSales - overhead;

		// Push the variables into the table
		table.push([departmentID, departmentName, "$" + overhead, "$" + deptSales, "$" + profit]);
		}

		// Log the table to the console and show the initial menu again
		console.log(table.toString());
		listMenu();
	});
}


// Create a new department by inserting new information into the departments table
function createNewDept() {
inquirer.prompt([
    {
     name: "dept",
     type: "input",
     message: "What is the name of the department you would like to create?"
    },
    {
     name: "overhead",
     type: "input",
     message: "What is the overhead costs for this department?",
     validate: function(value) {
       if (isNaN(value) === false) {
         return true;
       }
         return false;          
       }
    }
   ]).then(function(user) {
   		// Run a query to insert the user's answers into the departments table
    	connection.query(
    		"INSERT INTO departments SET ?",
    		{
    			department_name: user.dept,
    			over_head_costs: user.overhead
    		},
    		function(err) {
    			if (err) throw err;
    			// Let the user know that the department was added and show the initial menu again
    			console.log("Department added successfully!");
    			listMenu();
    		}
    	);
    });
}


function quit() {
	console.log("Have a great day!");
	connection.end();
}


