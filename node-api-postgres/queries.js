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

const getMenuItems = (request, response) => {
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'f\';', (error, results) => {
    if (error) {
      throw error.stack
    }
    response.status(200).json(results.rows)
  })
}

const getSeasonalItems = (request, response) => {
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'t\';', (error, results) => {
    if (error) {
      throw error.stack
    }
    response.status(200).json(results.rows)
  })
}

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
    response.status(200).json(results.rows)
  })
}

const displayMenu = (request, response) => {
  pool.query('SELECT * FROM FoodItems;', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    response.status(200).json(results.rows)
  })
}

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
  for(let i = 0; i < count; i++) {
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
    sales[i] = {"food_id": menu[i].food_id, "item_name": menu[i].item_name, "amount_sold": amounts[i]}
  }

  response.status(200).json(sales)
}

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
  response.status(200).json(display)

}

const deleteEntry = (request, response) => {
  const id = parseInt(request.query.id)
  const tableName = String(request.query.table)
  const colName = String(request.query.pkcol)

  pool.query('DELETE FROM ' + tableName + ' WHERE ' + colName + ' = ' + id, (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    response.status(200).json(0)
  })
}

const restockReport = (request, response) => {
  pool.query('SELECT * FROM Inventory WHERE unit_quantity <= order_threshold', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    response.status(200).json(results.rows)
  })
}

const displayInventory = (request, response) => {
  pool.query('SELECT * FROM Inventory;', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    response.status(200).json(results.rows)
  })
}

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
  for(let i = 0; i < count; i++) {
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
      excess.push({"ingredient_id": inv[i].ingredient_id, "ingredient_name": inv[i].ingredient_name, "amount_sold": amounts[i], "reorder_value": inv[i].reorder_value, "percentage_sold": per})
    }
  }

  response.status(200).json(excess)
}

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
        return
      }
      response.status(201).json('Ingredient added with ID: ' + id)
    })
}

const addFoodItem = async (request, response) => {
  const params = request.query.array.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
  const name = String(params[0])
  const ingredients = JSON.parse(params[1]).split(',').map(element => {
    return Number(element);
  });

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
      response.status(201).json('Food Item added with ID: ' + id)
    })
}

const editTable = (request, response) => {
  const params = request.query.array.split(',')
  const table = String(params[0])
  const id = parseInt(params[1])
  const col = String(params[2])
  const val = params[3]
  const idCol = String(params[4])
  const msg = editItem(table, id, col, val, idCol)
  response.status(200).json(msg)
}

function editItem(table, id, col, val, idCol) {
  const stmt = "UPDATE " + table + " SET " + col + " = \'" + val + "'\ WHERE " + idCol + " = " + id + ";"
  pool.query(stmt, (error) => {
    if (error) {
      console.log(error.stack)
      return "Update Failed"
    }
    return ("Updated item from " + table + " with ID:" + id)
  })
}

const login = async (request, response) => {
  const name = String(request.query.name)
  const id = parseInt(request.query.id)

  var check = -1
  check = await new Promise((resolve) => {
    pool.query("SELECT employee_id FROM employee WHERE employee_name = $1;", [name], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].employee_id))
    })
  })
  if (check == -1) {
    response.status(200).json(-1)
  }
  else if (check != id) {
    response.status(200).json(0)
  }
  else {
    const mngr = await new Promise((resolve) => {
      pool.query("SELECT is_manager FROM employee WHERE employee_name = $1;", [name], (error, results) => {
        if (error) {
          console.log(error.stack)
          return
        }
        resolve(String(results.rows[0].is_manager))
      })
    })
    if (mngr.localeCompare('t')) {
      response.status(200).json(2)
    }
    else {
      response.status(200).json(1)
    }
  }
}

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

  console.log("Order placed sucessfully")
  order = []
  condiments = []
}

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
    var ret = null;
    return ret;
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

  const pad = function (num) { return ('00' + num).slice(-2) };
  const utc = new Date();
  const date = utc.getFullYear() + '-' + pad(utc.getMonth() + 1) + '-' + pad(utc.getDate())
  const time = new Date().toString().slice(16, 24)

  pool.query("INSERT INTO Transactions (transaction_id, order_id, payment_type, total_cost, payment_received, change_given, employee_id, time, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
    [transId, orderID, payType, totalCost, payment, change, employeeID, time, date], (error) => {
      if (error) {
        console.log(error.stack)
        return
      }
    })
}

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
}

const addItem = (request, response) => {
  const id = parseInt(request.params.id)
  order.push(id)
  console.log(order)
  response.status(200).json("Item " + id + " successfully added to order!")
}

const removeItem = (request, response) => {
  const id = parseInt(request.params.id)
  const index = order.indexOf(id)
  if(index > -1) {
    order.splice(index, 1)
    console.log(order)
    response.status(200).json("Item " + id + " successfully removed from order.")
  }
  else {
    response.status(200).json("Item " + id + " not found in order.")
  }
}

const clearCart = (request, response) => {
  order = []
  console.log(order)
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
  addItem,
  removeItem,
  clearCart
}