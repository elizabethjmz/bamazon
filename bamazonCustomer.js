/* ***************************** GLOBAL VARIABLES ***************************** */

    //Require npm packages
    var mysql = require("mysql");
    var inquirer = require("inquirer");
    //To format tables in command line
    var asTable = require ('as-table').configure ({ maxTotalWidth: 200, delimiter: ' | ' });

    //To establish db connection
    var connection = mysql.createConnection({
        host: "localhost",
        // Port; if not 3306
        port: 3306,
        // Username
        user: "root",
        // Password
        password: "root",
        database: "bamazon"
    });
      
    
/* ***************************** FUNCTIONS ***************************** */
    //Function to display list of products
    var displayProducts = function () {
        //Query to display all available products in stock
        var query = "SELECT * FROM products WHERE stock_quantity > 0;";
        connection.query(query, function(err, res) {
            //Display as table
            console.log("\n"+ asTable(res));
            toDo();
        });
    };

    //Function for the user to enter product id and units to place order
    var toDo = function () {
        console.log ("\n");
        inquirer
            .prompt({
            name: "product_id",
            type: "input",
            message: "Enter 'item_id' of the product that you would like to buy?",
            //To validate that a number is entered
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            })
            .then(function(answer) {
                inquirer
                    .prompt({
                    name: "units",
                    type: "input",
                    message: "How many units would like to buy?",
                    //To validate that a number is entered
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                    })
                    .then(function(ans) {
                        //To check if there is sufficient stock for selected product
                        validateStock(parseInt(answer.product_id), parseInt(ans.units));
                    });
        });
    };

    //Function to validate if there is sufficient stock for selected item
    var validateStock = function (product_id, units) {
    
        var query = "SELECT stock_quantity FROM products WHERE ?";

        connection.query(query, { item_id: product_id}, function(err, res) {
            
            var stock = parseInt(res[0].stock_quantity);
            //If there is stock for selected item, order is placed
            if ( stock > 0 && units <= stock) {
                var newqty = stock - units;
                placeOrder(product_id, newqty, units);
            }
            else {
                //Insufficient quantity, order not placed
                console.log("\n====================================================================");
                console.log("Opps! sorry, unfortunately there is not enough stock for this item");
                console.log("=====================================================================\n");
                ask(); //End session or make another purchase
            }
        });
    };

    //Function to place order and get total cost of the order
    var placeOrder = function (id, quantity, units) {

        var query1 = "UPDATE products SET stock_quantity ="+quantity+" WHERE ?";
        
        connection.query(query1, { item_id: id}, function(err, res) {
            var query2= "SELECT price FROM products WHERE ?";
            connection.query(query2, { item_id: id}, function(err, response) {
                console.log("\n=============================================================================");
                console.log("Order has been placed! \nThe total cost for your order was: $"+((response[0].price)*units));
                console.log("==============================================================================\n");
                ask();  //End session or make another purchase
            });
        });
    };

    //Function to confirm if users would like to end session or make another purchase
    var ask = function () {
        inquirer
                .prompt({
                name: "confirm",
                type: "confirm",
                message: "Would you like to buy another product?",
                default: true
                })
                .then(function(response) {
                    if(response.confirm){
                        displayProducts();
                    }
                    else {
                        console.log("\n============================================");
                        console.log ("Session Ended. Thank you for your visit!");
                        console.log("============================================\n");
                    }
                });
    };


/* ***************************** CALLS ***************************** */
    connection.connect(function(err) {
        if (err) throw err;
        displayProducts();
    });