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
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'f\'', (error, results) => {
    if (error) {
      throw error.stack
    }
    response.status(200).json(results.rows)
  })
}

const getSeasonalItems = (request, response) => {
  pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'t\'', (error, results) => {
    if (error) {
      throw error.stack
    }
    response.status(200).json(results.rows)
  })
}

const getItemName = (request, response) => {
  const id = parseInt(request.params.id)

  console.log(id)
  pool.query('SELECT * FROM FoodItems WHERE food_id = $1', [id], (error, results) => {
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

const displayOrder = (request, response) => {
  order = []
  for(let i = 0; i < request.length; i++) {
    pool.query('SELECT * FROM WHERE food_id = $1', [request[i]], (error, results) => {
      if (error) {
        console.log(error.stack)
        return
      }
      order[i] = results.rows[0]
    })
  }
  response.status(200).json(order)
}

const displayMenu = (request, response) => {
  pool.query('SELECT * FROM FoodItems', (error, results) => {
    if (error) {
      console.log(error.stack)
      return
    }
    response.status(200).json(results.rows)
  })
}

const excessReport = (request, response) => {
  const {start, end} = request.body
  results = getExcess(start, end)
  response.status(200).json(results)
}

function getExcess(start, end) {
  const amounts = []
  
}

module.exports = {
  getMenuItems,
  getSeasonalItems,
  getItemName,
  displayOrder,
  displayMenu,
  excessReport
}