
// const { Pool, Client } = require('pg')
// const connectionString = 'postgresql://csce315_901_quilici:630004248@csce-315-db.engr.tamu.edu:5432/csce315_901_1?sslmode=require'

// const pool = new Pool({
//   connectionString,
// })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
// const client = new Client({
//   connectionString,
// })
// client.connect()
// client.query('SELECT * FROM Inventory', (err, res) => {
//   if (!err) {
//     console.log(res.rows[0]);
//   }
//   else {
//     console.log(err.message);
//   }
//   console.log(err, res)
//   client.end()
// })

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'csce315_901_quilici',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_901_1',
  password: '630004248',
  port: 5432,
  ssl: true
})


const getUsers = (request, response) => {
  pool.query('SELECT * FROM FoodItems ORDER BY food_id ASC', (error, results) => {
    if (error) {
      throw error.stack
    }
    response.status(200).json(results.rows)
  })
}


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

// const getSeasonalItems = (request, response) => {
//   try {
//     pool.query('SELECT * FROM FoodItems WHERE is_seasonal = \'t\'', (error, results) => {
//       response.status(200).json(results.rows)
//     })
//   }
//   catch (error) {
//     console.log(error)
//   }
// }

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


// const getItemName = (request, response) => {
//   const id = parseInt(request.params.id)

//   console.log(id)
//   pool.query('SELECT * FROM FoodItems WHERE food_id = $1', [id], (error, results) => {
//     if (error) {
//       throw error.stack
//     }
//     response.status(200).json(results.rows)
//   })
// }


module.exports = {
  getUsers,
  getMenuItems,
  getSeasonalItems,
  getItemName
}