const express = require('express')
const cors = require('cors')
require ('./db/mongoose')
const stdRouter = require('./routers/student')
const profRouter = require('./routers/professor')
const adminRouter = require('./routers/admin')
const Admin = require('./models/admin')
const Prof = require('./models/professor')
const Std = require('./models/student')


const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/students', stdRouter)
app.use('/professors', profRouter)
app.use('/admin', adminRouter)
app.post('', async(req, res) => {
    try {
        const admin= await Admin.findByCredentials(req.body.email, req.body.password)
        if(!admin.error)
            res.status(200).json(admin)
        const prof = await Prof.findByCredentials(req.body.email, req.body.password)
        if(!prof.error) res.json(prof)
        const std = await Std.findByCredentials(req.body.email, req.body.password)
        if(!std.error) res.json(std)
        res.status(400).json()
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})
app.listen(port, () => {
    console.log('server is app on port '+ port)
})