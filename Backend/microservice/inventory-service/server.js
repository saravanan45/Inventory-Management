const app = require('./app')

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Inventory Service is running on port ${PORT}`)
})