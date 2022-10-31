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
  const start = String(request.params.start)
  const end = String(request.params.end)
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
  console.log(amounts)
  console.log(start)
  require('moment')().format('YYYY-MM-DD HH:mm:ss');
  console.log(date)
  const dates = await new Promise((resolve) =>  {
    pool.query("SELECT * FROM date WHERE date BETWEEN \'$1\' AND \'$2\';", [date, end], (error, results) => {
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
  //pool.query("SELECT * FROM Inventory;")

  response.status(200).json(amounts)
}

module.exports = {
  getMenuItems,
  getSeasonalItems,
  getItemName,
  displayMenu,
  excessReport
}