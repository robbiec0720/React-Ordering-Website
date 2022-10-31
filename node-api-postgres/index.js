const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const db = require('./queries')



app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.get('/menuItems', db.displayMenu)
app.get('/menuItems/permanent', db.getMenuItems)
app.get('/menuItems/:id', db.getItemName)
app.get('/menuItems/seasonal', db.getSeasonalItems)
app.get('/excess/:start/:end', db.excessReport)
app.get('/login', db.login)
app.post('/inventory/add', db.addIngredient)
app.put('/edit', db.editTable)