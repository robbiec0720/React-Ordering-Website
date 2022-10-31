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
app.post('/menuItems/add', db.addFoodItem)
app.get('/excess/:start/:end', db.excessReport)
app.get('/login', db.login)
app.post('/inventory/add', db.addIngredient)
app.get('/inventory', db.displayInventory)
app.get('/inventory/restock-report', db.restockReport)
app.post('/order/submit', db.orderSubmitted)
app.get('/order/display', db.displayOrder)
app.delete('/entry/delete', db.deleteEntry)
app.put('/edit', db.editTable)