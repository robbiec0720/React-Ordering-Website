const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8081

const db = require('./queries')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const corsOptions = { origin : true }

app.get('/', cors(corsOptions), (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.get('/menuItems', cors(corsOptions), db.displayMenu)
app.get('/menuItems/permanent', cors(corsOptions), db.getMenuItems)
app.get('/menuItems/:id', cors(corsOptions), db.getItemName)
app.get('/menuItems/seasonal', cors(corsOptions), db.getSeasonalItems)
app.post('/menuItems/add', cors(corsOptions), db.addFoodItem)
app.get('/excess/:start/:end', cors(corsOptions), db.excessReport)
app.get('/sales/:start/:end', cors(corsOptions), db.salesReport)
app.get('/login', cors(corsOptions), db.login)
app.post('/inventory/add', cors(corsOptions), db.addIngredient)
app.get('/inventory', cors(corsOptions), db.displayInventory)
app.get('/inventory/restock-report', cors(corsOptions), db.restockReport)
app.get('/order/add/:id', cors(corsOptions), db.addItem)
app.get('/order/remove/:id', cors(corsOptions), db.removeItem)
app.get('/order/clear', cors(corsOptions), db.clearCart)
app.post('/order/submit', cors(corsOptions), db.orderSubmitted)
app.get('/order/display', cors(corsOptions), db.displayOrder)
app.delete('/entry/delete', cors(corsOptions), db.deleteEntry)
app.put('/edit', cors(corsOptions), db.editTable)