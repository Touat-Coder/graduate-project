const express = require('express')
const cors = require('cors')
require ('./db/mongoose')
stdRouter = require('./routers/student')
profRouter = require('./routers/professor')
adminRouter = require('./routers/admin')


const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/students', stdRouter)
app.use('/professors', profRouter)
app.use('/admin', adminRouter)
app.listen(port, () => {
    console.log('server is app on port '+ port)
})