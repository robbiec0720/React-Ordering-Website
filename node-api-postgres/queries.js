const mmnt = require('moment')
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'csce315_901_quilici',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_901_1',
  password: '630004248',
  port: 5432,
  ssl: true
})

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

  console.log(id)
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

const excessReport = async (request, response) => {
  const start = new Date(request.params.start).toISOString().slice(0, 10)
  const end = new Date(request.params.end).toISOString().slice(0, 10)
  const excess = []
  const count = await new Promise((resolve) =>  {
    pool.query("SELECT COUNT(*) FROM Inventory;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(parseInt(results.rows[0].count))
    })
  })
  const amounts = new Array(count)

  const dates = await new Promise((resolve) =>  {
    pool.query("SELECT * FROM date WHERE date BETWEEN $1 AND $2;", [start, end], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })

  for(let i = 0; i < dates.length; i++) {
    for(let j = 0; j < dates[i].ingredient_amounts; j++) {
      amounts[j] += dates[i].ingredient_amounts[j]
    }   
  }
  const inv = await new Promise((resolve) => {
    pool.query("SELECT * FROM Inventory;", (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      resolve(results.rows)
    })
  })
  
  for(let i = 0; i < inv.length; i++) {
    if(amounts[i] <= 0.1*inv[i].unit_quantity) {
      excess.push(inv[i])
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
      if(error) {
        error.stack()
        return
      }
      resolve(results.rows[0].max)
    })
  }) + 1
  
  pool.query("INSERT INTO Inventory (ingredient_id, ingredient_name, unit_quantity, order_threshold, reorder_value, cost) VALUES ($1, $2, $3, $4, $5, $6);", 
  [id, name, quantity, threshold, reorder, cost], (error) =>{
    if(error) {
      console.log(error)
      return
    }
    response.status(201).send('Ingredient added with ID: ' + id)
  })
}

const editTable = (request, response) => {
  const params = request.query.array.split(',')
  const table = String(params[0])
  const id = parseInt(params[1])
  const col = String(params[2])
  const val = params[3]
  const idCol = String(params[4])
  const stmt = "UPDATE " + table + " SET " + col + " = \'" + val + "'\ WHERE " + idCol + " = " + id + ";"
  pool.query(stmt, (error) =>{
    if(error) {
      console.log(error)
      return
    }
    response.status(200).send('Updated item from ' + table + ' with ID:' + id)
  })
}

module.exports = {
  getMenuItems,
  getSeasonalItems,
  getItemName,
  displayMenu,
  excessReport,
  addIngredient,
  editTable
}