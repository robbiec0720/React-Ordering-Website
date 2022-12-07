const Pool = require('pg').Pool
const pool = new Pool({
  user: 'csce315_901_quilici',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_901_1',
  password: '630004248',
  port: 5432,
  ssl: true
})

// arrays to store order and condiments
var order = []
var condiments = []

/**
 * Called to request all of the information about the menu items which are stored in the DB (not seasonal).
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response All items from the DB FoodItems table that are not seasonal.
 * 
 */
const getMenuItems = (request, response) => {
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'f\';', (error, results) => {
    if (error) {
      throw error.stack
    }
    console.log("Succesfully returned menu items")
    response.status(200).json(results.rows)
  })
}

/**
 * Called to request all of the information about the menu items which are stored in the DB which are seasonal.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response All items from the DB FoodItems table that are not seasonal.
 * 
 */
const getSeasonalItems = (request, response) => {
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'t\';', (error, results) => {
    if (error) {
      throw error.stack
    }
    console.log("Succesfully returned seasonal itemss.")
    response.status(200).json(results.rows)
  })
}

/**
 * Called to request all of the information about the menu items which are stored in the DB.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response All items from the DB FoodItems table that are not seasonal.
 * 
 */
const getItemName = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM FoodItems WHERE food_id = $1;', [id], (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    if (results.rows[0] == null) {
      console.log("Food item does not exist")
      return
    }
    console.log("Succesfully got item name for id = " + id + ".")
    response.status(200).json(results.rows)
  })
}

/**
 * Makes a query to the database that fetches all of the rows of the FoodItems table in JSON format. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response All items from the DB FoodItems table whether or not they are seasonal in JSON format.
 * 
 */
const displayMenu = (request, response) => {
  pool.query('SELECT * FROM FoodItems;', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    console.log("Succesfully displayed menu.")
    response.status(200).json(results.rows)
  })
}

/**
 * Makes a query to the database that fetches all of the rows of the FoodItems table in JSON format. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response All items from the DB FoodItems table whether or not they are seasonal in JSON format.
 * @property {request.params.start} start The first parameter of the API call which represents the start date.
 * @property {request.params.end} end The second parameter of the API call which represents the end date.
 */
const salesReport = async (request, response) => {
  const start = new Date(request.params.start).toISOString().slice(0, 10)
  const end = new Date(request.params.end).toISOString().slice(0, 10)
  const sales = []

  const count = await new Promise((resolve) => {
    pool.query("SELECT COUNT(*) FROM FoodItems;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].count))
    })
  })
  const amounts = new Array(count)
  for (let i = 0; i < count; i++) {
    amounts[i] = 0
  }

  const dates = await new Promise((resolve) => {
    pool.query("SELECT * FROM date WHERE date BETWEEN $1 AND $2;", [start, end], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  const menu = await new Promise((resolve) => {
    pool.query("SELECT * FROM FoodItems ORDER BY food_id ASC;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < dates[i].menu_amounts.length; j++) {
      amounts[j] += dates[i].menu_amounts[j]
    }
  }

  for (let i = 0; i < menu.length; i++) {
    sales[i] = { "food_id": menu[i].food_id, "item_name": menu[i].item_name, "amount_sold": amounts[i] }
  }

  console.log("Succesfully returned sales report starting at date " + start + " and ending at date " + end + ".")
  response.status(200).json(sales)
}

/**
 * Makes a query to the database that fetches all of the rows of the Orders table in JSON format. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response All items from the DB Order table  in JSON format.
 * 
 */
const displayOrder = async (request, response) => {
  const display = []
  for (var i = 0; i < order.length; i++) {
    display.push(await new Promise((resolve) => {
      pool.query("SELECT * FROM Orders WHERE order_id = " + order[i], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(results.rows)
      })
    }))
  }

  // TODO: Add error checking
  console.log("Succesfully displayed order.")
  response.status(200).json(display)

}

/**
 * Makes a query to the database that fetches all of the rows of the FoodItems table in JSON format. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 * @property {request.query.id} id The first parameter of the API call which represents the id to be deleted.
 * @property {request.query.table} tableName The second parameter of the API call which represents the name of the table from which the id is to be deleted.
 * @property {request.query.pkcol} colName The third parameter of the API call which represents the name of the primary key column as a string.
 */
const deleteEntry = async (request, response) => {
  const id = parseInt(request.query.id)
  const tableName = String(request.query.table)
  const colName = String(request.query.pkcol)

  // checking if item exists
  const exists = "SELECT COUNT(*) FROM " + tableName + " WHERE " + colName + " = " + id + ";"
  const count = await new Promise((resolve) => {
    pool.query(exists, (error, results) => {
      if (error) {
        console.log(error.stack)
        return "Error"
      }
      resolve(parseInt(results.rows[0].count))
    })
  })

  // if id does not exist, return error message
  if (count == 0) {
    response.status(200).json(tableName + " does not have an item with ID: " + id)
  }
  else {
    pool.query('DELETE FROM ' + tableName + ' WHERE ' + colName + ' = ' + id, (error, results) => {
      if (error) {
        console.log(error.stack)
        response.status(200).json('Error in deleting entry from ' + tableName + 'with ID: ' + id)
        return
      }
      console.log("Succesfully deleted " + colName + " = " + id + " from table " + tableName + ".")
      response.status(200).json('Deleted entry from ' + tableName + 'with ID: ' + id)
    })
  }
}

/**
 * Makes a query to the database that fetches all inventory items whose quantity is below their respective order threshold.
 * 
 * @param {request} request - The input parameters that are passed through the URL request. In this case none.
 * @param {response} response All inventory items whose quantity is below their respective order threshold in JSON format.
 */
const restockReport = (request, response) => {
  pool.query('SELECT * FROM Inventory WHERE unit_quantity <= order_threshold', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    console.log("Succesfully returned restock repot.")
    response.status(200).json(results.rows)
  })
}

/**
 * Makes a query to the database that updates all inventory items that are below their respective order threshold.
 * Also calls editItem while processing request.
 * 
 * @param {request} request - The input parameters that are passed through the URL request. In this case none.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 * @see editItem
 */
const restock = async (request, response) => {
  const reorder = await new Promise((resolve) => {
    pool.query('SELECT * FROM Inventory WHERE unit_quantity <= order_threshold', (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  for (let i = 0; i < reorder.length; i++) {
    editItem('Inventory', reorder[i].ingredient_id, 'unit_quantity', reorder[i].reorder_value, 'ingredient_id')
  }

  console.log("Succesfully completed restock.")
  response.status(200).json('Inventory has been restocked!')
}

/**
 * Makes a query to the database that fetches all items from the Inventory table in JSON format.
 * 
 * @param {request} request - The input parameters that are passed through the URL request. In this case none.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 */
const displayInventory = (request, response) => {
  pool.query('SELECT * FROM Inventory;', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    console.log("Succesfully displayed inventory.")
    response.status(200).json(results.rows)
  })
}

/**
 * Executes an excess report on any items that were sold between two dates. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response The data corresponding to the excess report in JSON format.
 * @property {request.params.start} start The first parameter of the API call which represents the start date.
 * @property {request.params.end} end The second parameter of the API call which represents the end date.
 */
const excessReport = async (request, response) => {
  const start = new Date(request.params.start).toISOString().slice(0, 10)
  const end = new Date(request.params.end).toISOString().slice(0, 10)
  const excess = []
  const count = await new Promise((resolve) => {
    pool.query("SELECT COUNT(*) FROM Inventory;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].count))
    })
  })
  const amounts = new Array(count)
  for (let i = 0; i < count; i++) {
    amounts[i] = 0
  }

  const dates = await new Promise((resolve) => {
    pool.query("SELECT * FROM date WHERE date BETWEEN $1 AND $2;", [start, end], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < dates[i].ingredient_amounts.length; j++) {
      amounts[j] += dates[i].ingredient_amounts[j]
    }
  }
  const inv = await new Promise((resolve) => {
    pool.query("SELECT * FROM Inventory ORDER BY ingredient_id ASC;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  for (let i = 0; i < inv.length; i++) {
    if (amounts[i] <= 0.1 * inv[i].unit_quantity) {
      var per = Math.round(amounts[i] / inv[i].reorder_value * 10000) / 100
      excess.push({ "ingredient_id": inv[i].ingredient_id, "ingredient_name": inv[i].ingredient_name, "amount_sold": amounts[i], "reorder_value": inv[i].reorder_value, "percentage_sold": per })
    }
  }

  console.log("Succesfully completed excess report query.")
  response.status(200).json(excess)
}

/**
 * Makes a query to the database that adds an ingredient to the Ingredients table. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 * @property {request.query.array.split(',')} params The parameter of the API call which is a comma separated list of items (name, 
 * quantity, threshold, reorder, cost, id) which hold the values of the ingredient to be added, respectively.
 */
const addIngredient = async (request, response) => {
  const params = request.query.array.split(',')
  const name = String(params[0])
  const quantity = parseInt(params[1])
  const threshold = parseInt(params[2])
  const reorder = parseInt(params[3])
  const cost = parseFloat(params[4])
  const id = await new Promise((resolve) => {
    pool.query("SELECT MAX(ingredient_id) FROM Inventory;", (error, results) => {
      if (error) {
        error.stack()
        return
      }
      resolve(results.rows[0].max)
    })
  }) + 1

  pool.query("INSERT INTO Inventory (ingredient_id, ingredient_name, unit_quantity, order_threshold, reorder_value, cost) VALUES ($1, $2, $3, $4, $5, $6);",
    [id, name, quantity, threshold, reorder, cost], (error) => {
      if (error) {
        console.log(error.stack)
        response.status(201).json('Error in adding ingredient')
        return
      }
      console.log('Ingredient added with ID: ' + id)
      response.status(201).json('Ingredient added with ID: ' + id)
    })
}

/**
 * Makes a query to the database that adds an ingredient to the Ingredients table. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 * @property {request.query.array.split(',')} params The parameter of the API call which is a comma separated list of items (name, ingredients, cost
 * type, isSeasonal, id) which hold the values of the ingredient to be added, respectively.
 */
const addFoodItem = async (request, response) => {
  const params = request.query.array.split(',')
  console.log(params)
  const name = String(params[0])
  const ingredients = params[1].split(':').map(element => {
    return Number(element)
  })

  const cost = parseFloat(params[2])
  const type = parseInt(params[3])
  const isSeasonal = Boolean(params[4])
  const id = await new Promise((resolve) => {
    pool.query("SELECT MAX(food_id) FROM FoodItems;", (error, results) => {
      if (error) {
        error.stack()
        return
      }
      resolve(results.rows[0].max)
    })
  }) + 1

  pool.query("INSERT INTO FoodItems (food_id, item_name, ingredients, cost, item_type, is_seasonal) VALUES ($1, $2, $3, $4, $5, $6);",
    [id, name, ingredients, cost, type, isSeasonal], (error) => {
      if (error) {
        console.log(error.stack)
        return
      }
      console.log('Food Item added with ID: ' + id)
      response.status(201).json('Food Item added with ID: ' + id)
    })
}

/**
 * Makes a query to the database that adds an ingredient to the Ingredients table. 
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response Responds with code 200 on success or an error otherwise.
 * @property {request.query.array.split(',')} params The parameter of the API call which is a comma separated list of items (table, 
 * id, col, val, idCol, msg) which hold the values of the ingredient to be added, respectively.
 */
const editTable = async (request, response) => {
  const params = request.query.array.split(',')
  const table = String(params[0])
  const id = parseInt(params[1])
  const col = String(params[2])
  const val = params[3]
  const idCol = String(params[4])
  const msg = await editItem(table, id, col, val, idCol)
  console.log("Succesfully edited table with information: table = " + table + ", id = " + id + ", column = " + col + ", value = " + val + ", column_id = " + idCol + ".")
  response.status(200).json(msg)
}

/**
 * Makes a query to the database that fetches the id that corresponds to a given employee's email address.
 * 
 * @param {request} request - The input parameters that are passed through the URL request described in the properties section below.
 * @param {response} response Responds with the id of the employee, if they exist in the database.
 * @property {request.query.email} email The parameter of the API call which represents the email of the requested employee as a string.
 */
const getEmployeeID = async (request, response) => {
  const email = String(request.query.email)
  // console.log("EMAIL = " + email)
  const query = "SELECT employee_id FROM employee WHERE email = '" + email + "';"
  const id = await new Promise((resolve => {
    pool.query(query, (error, results) => {
      if (error) {
        console.log(error.stack)
        return "Error"
      }
      if (results.rowCount == 0) {
        console.log("Invalid employee")
        resolve(-1)
        return
      }
      resolve(parseInt(results.rows[0].employee_id))
    })
  }))


  if (id == - 1) {
    console.log("Employee with email " + email + " does not exist. Returning with error code -1.")
  }
  else {
    console.log("Succesfully got employee_id = " + id + " where email = " + email + ".")
  }
  response.status(200).json(id)
}

async function editItem(table, id, col, val, idCol) {
  // checking if item exists
  const exists = "SELECT COUNT(*) FROM " + table + " WHERE " + idCol + " = " + id + ";"
  const count = await new Promise((resolve) => {
    pool.query(exists, (error, results) => {
      if (error) {
        console.log(error.stack)
        return "Error"
      }
      resolve(parseInt(results.rows[0].count))
    })
  })

  // if id does not exist, return error message
  if (count == 0) {
    return (table + " does not have an item with ID: " + id)
  }

  const stmt = "UPDATE " + table + " SET " + col + " = \'" + val + "'\ WHERE " + idCol + " = " + id + ";"
  pool.query(stmt, (error) => {
    if (error) {
      console.log(error.stack)
      return "Error"
    }
  })
  console.log("Succesfully updated item from " + table + " with ID: " + id + ".")
  return ("Updated item from " + table + " with ID: " + id)
}

const login = async (request, response) => {
  const name = String(request.query.name)
  const id = String(request.query.id)

  var check = "-1"
  check = await new Promise((resolve) => {
    pool.query("SELECT password FROM employee WHERE email = $1;", [name], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      if (results.rowCount == 0) {
        console.log("Invalid employee")
        resolve("-1")
      }
      else {
        resolve(String(results.rows[0].password))
      }
    })
  })
  if (check.localeCompare(id) != 0) {
    response.status(200).json(-1)
  }
  else if (check.localeCompare(id) != 0) {
    response.status(200).json(0)
  }
  else {
    console.log("Succesful login with email = " + name + ", password = " + id + ".")
    const mngr = await new Promise((resolve) => {
      pool.query("SELECT is_manager FROM employee WHERE email = $1;", [name], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(String(results.rows[0].is_manager))
      })
    })
    if (mngr.localeCompare('t') == 0) {
      response.status(200).json(2)
    }
    else {
      response.status(200).json(1)
    }
  }
}

/**
 * Uses helper functions to place the order and corresponding transaction to the website.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, id, type, and payment.
 * @param {response} response - -1 for a failed submission, and 0 for a successful one.
 * 
 */
const orderSubmitted = async (request, response) => {
  const id = parseInt(request.query.id)
  const payType = parseInt(request.query.type)
  const payment = parseFloat(request.query.payment)

  condiments.push(26)
  condiments.push(27)

  const orderInfo = await placeOrder(payment, payType)

  if (orderInfo == null) {
    response.status(200).json(-1)
  }
  else {
    placeTransaction(orderInfo[0], id, payType, orderInfo[1], payment)
    updateInventory()
    response.status(200).json(0)
  }

  console.log("Succesfully placed order with id = " + id + ", paymentType = " + payment + ", payment = " + payment + ".")
  order = []
  condiments = []
}

/**
 * Places an order entry into the database.
 * @param {double} payment - Double denoting the payment recieved from the customer.
 * @param {int} payType - Integer denoting what payment type was used (0 = cash, 1 = card, 2 = dining dollars).
 * 
 */
async function placeOrder(payment, payType) {
  const id = await new Promise((resolve) => {
    pool.query("SELECT MAX(order_id) FROM Orders;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].max))
    })
  }) + 1

  const entrees = []
  const sides = []
  const drinks = []
  const desserts = []

  var totalCost = 0.0
  for (let n = 0; n < order.length; n++) {
    var type = -1
    var cost = 0.0
    var i = order[n]

    var item = await new Promise((resolve) => {
      pool.query("SELECT * FROM FoodItems where food_id = $1;", [i], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(results.rows[0])
      })
    })

    type = parseInt(item.item_type)
    cost = parseFloat(item.cost)

    if (type != -1) {
      totalCost += cost
    }

    if (type == 0) {
      entrees.push(i)
    }

    if (type == 1) {
      sides.push(i)
    }

    if (type == 2) {
      drinks.push(i)
    }

    if (type == 3) {
      drinks.push(i)
    }
  }

  // If the emplyee enters a payment received that is less than the total cost,
  // indicate error by returning a null array
  if (payment < totalCost && payType == 0) {
    var ret = null
    return ret
  }

  pool.query("INSERT INTO Orders (order_id, entree_items, side_items, drink_items, dessert_items, condiments, order_cost) VALUES ($1, $2, $3, $4, $5, $6, $7);",
    [id, entrees, sides, drinks, desserts, condiments, totalCost], (error) => {
      if (error) {
        console.log(error.stack)
        return
      }
    })

  orderInfo = [id, totalCost]
  return orderInfo
}

/**
 * Places a transaction entry into the database.
 * @param {int} orderID - Double denoting the corresponding order id.
 * @param {int} employeeID - Integer denoting the id of the employee placing the transaction.
 * @param {int} payType - Integer denoting what payment type was used (0 = cash, 1 = card, 2 = dining dollars).
 * @param {double} subtotal - Double denoting the subtotal of the transaction.
 * @param {double} payment - Double denoting the payment recieved from the customer.
 * 
 */
async function placeTransaction(orderID, employeeID, payType, subtotal, payment) {
  const transId = await new Promise((resolve) => {
    pool.query("SELECT MAX(transaction_id) FROM Transactions;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].max))
    })
  }) + 1

  const totalCost = Math.round(subtotal * 1.0825 * 100) / 100.0
  if (payType == 1 || payType == 2) {
    payment = totalCost
  }
  const change = Math.round((payment - totalCost) * 100) / 100.0

  const pad = function (num) { return ('00' + num).slice(-2) }
  const utc = new Date()
  const date = utc.getFullYear() + '-' + pad(utc.getMonth() + 1) + '-' + pad(utc.getDate())
  const time = new Date().toString().slice(16, 24)

  pool.query("INSERT INTO Transactions (transaction_id, order_id, payment_type, total_cost, payment_received, change_given, employee_id, time, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
    [transId, orderID, payType, totalCost, payment, change, employeeID, time, date], (error) => {
      if (error) {
        console.log(error.stack)
        return
      }
    })

  console.log("Succesfully placed transaction with orderID = " + orderID + ", employeeID = " + employeeID + ", paymentType = " + payType + ", subtotal = " + subtotal + ", payment = " + payment + ".")
}

/**
 * Updates the inventory after an order is placed.
 * 
 */
async function updateInventory() {
  for (let i = 0; i < order.length; i++) {
    var ingredients = await new Promise((resolve) => {
      pool.query('SELECT ingredients FROM FoodItems WHERE food_id = $1;', [order[i]], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(results.rows[0].ingredients)
      })
    })

    for (let j = 0; j < ingredients.length; j++) {
      var id = ingredients[j]
      var val = await new Promise((resolve) => {
        pool.query('SELECT unit_quantity FROM Inventory WHERE ingredient_id = $1', [id], (error, results) => {
          if (error) {
            console.log(error.stack)
            return
          }
          resolve(results.rows[0].unit_quantity)
        })
      }) - 1
      editItem('Inventory', id, "unit_quantity", val, "ingredient_id")
    }
  }

  for (let k = 0; k < condiments.length; k++) {
    var c_id = condiments[k]
    var c_val = await new Promise((resolve) => {
      pool.query('SELECT unit_quantity FROM Inventory WHERE ingredient_id = $1', [c_id], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(results.rows[0].unit_quantity)
      })
    }) - 1
    editItem('Inventory', c_id, "unit_quantity", c_val, "ingredient_id")
  }
  console.log("Succesfully updated inventory.")
}

/**
 * Takes the item in the request and adds it to the order array.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, id.
 * @param {response} response - A confirmation message that the item was added to the order,
 * 
 */
const addItem = (request, response) => {
  const id = parseInt(request.params.id)
  order.push(id)
  console.log("Succesfully added item with id = " + id + ".")
  console.log("Current state of order = " + order)
  response.status(200).json("Item " + id + " successfully added to order!")
}

/**
 * Removes the item with the id specified in the request from the order array.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, id.
 * @param {response} response - A message indicating if the item was removed or not.
 * 
 */
const removeItem = (request, response) => {
  const id = parseInt(request.params.id)
  const index = order.indexOf(id)
  if (index > -1) {
    order.splice(index, 1)
    console.log(order)
    console.log("Succesfully removed item " + id + "from order.")
    response.status(200).json("Item with id = " + id + " successfully removed from order.")
  }
  else {
    console.log("Failed to remove item with id = " + id + "from order. Is it currently in the order?")
    response.status(200).json("Item " + id + " not found in order.")
  }
}

/**
 * Clears the current order array.
 * @param {request} request - The input parameters that are passed through the URL request. In this case, none.
 * @param {response} response - A confirmation message that the cart was cleared.
 * 
 */
const clearCart = (request, response) => {
  order = []
  console.log("Current state of order = " + order)
  console.log("Succesfully cleared cart")
  response.status(200).json("Cart successfully cleared.")
}

module.exports = {
  getMenuItems,
  getSeasonalItems,
  getItemName,
  displayMenu,
  salesReport,
  excessReport,
  addIngredient,
  editTable,
  login,
  orderSubmitted,
  placeOrder,
  placeTransaction,
  updateInventory,
  displayInventory,
  displayOrder,
  addFoodItem,
  deleteEntry,
  restockReport,
  restock,
  addItem,
  removeItem,
  clearCart,
  getEmployeeID
}