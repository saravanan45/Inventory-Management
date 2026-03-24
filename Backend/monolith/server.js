const app = require('./src/app')

const PORT = 3010

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})