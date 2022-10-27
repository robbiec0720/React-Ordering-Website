const Pool = require('pg').Pool
const pool = new Pool({
  user: 'csce315_901_quilici',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_901_1',
  password: '630004248',
  port: 5432
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM Inventory ORDER BY ingredient_id ASC', (error, results) => {
      if (error) {
        throw error.message
      }
      response.status(200).json(results.rows)
    })
  }

  module.exports = {
    getUsers
  }