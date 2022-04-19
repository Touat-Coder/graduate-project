const express = require('express')
require ('./db/mongoose')
stdRouter = require('./routers/student')
profRouter = require('./routers/professor')
adminRouter = require('./routers/admin')
const Std = require('./models/student')
const upload = require('express-fileupload')
const xlsx = require('xlsx')
const app = express()
const port = process.env.PORT || 3000
app.use(upload())
app.use(express.json())
app.use('/students', stdRouter)
app.use('/professors', profRouter)
app.use('/admin', adminRouter)

// app.post('/list', async (req,res) => {
//     // if(!req.file.stdfile) throw new Error({error: 'wrong no key'})
//     try {
//         const file = req.files.stdfile

//         if(!file.name.match(/\.(xls|xlsx)$/))
//             res.status(400).send('plese enter an excel file')
//         console.log(file.name)
//         await file.mv('./lists/'+ file.name, (err, result) => {
//             // if (err) throw err
//             console.log('hi there')
//             //read excel file
//             const wb = xlsx.readFile('./lists/'+ file.name)
//             const ws = wb.Sheets['G1']
//             // convert the data of the file to json
//             const stdJson = xlsx.utils.sheet_to_json(ws)
//             // const newdata = stdJson.map((i) => i.name)
//             const list = stdJson.map((i) => {
//                 const std =  new Std(i)
//                 std.save()
//             })
//             res.send(list)
//         })
//     } catch (e) {
//         console.log(e)
//         res.status(400).send(e)
//     }
// })


app.listen(port, () => {
    console.log('server is app on port '+ port)
})