const express = require('express')
const Std = require('../models/student')
const router = new express.Router()
const upload = require('express-fileupload')
const xlsx = require('xlsx')

const app = express()
app.use(upload())
router.get('', async (req,res) => {
    try {
        const std =await Std.find()
        res.send(std)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}) 
router.post('', async(req,res) => {
    const std = new Std(req.body)
    try {
        await std.save()
        res.send(std)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/list', async (req,res) => {
    // if(!req.file.stdfile) throw new Error({error: 'wrong no key'})
    try {
        const file = req.files.stdfile

        if(!file.name.match(/\.(xls|xlsx)$/))
            res.status(400).send('plese enter an excel file')
        console.log(file.name)
        await file.mv('./lists/'+ file.name, (err, result) => {
            // if (err) throw err
            console.log('hi there')
            //read excel file
            const wb = xlsx.readFile('./lists/'+ file.name)
            const ws = wb.Sheets['G1']
            // convert the data of the file to json
            const stdJson = xlsx.utils.sheet_to_json(ws)
            // const newdata = stdJson.map((i) => i.name)
            const list = stdJson.map((i) => {
                const std =  new Std(i)
                std.save()
            })
            res.send(list)
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/login', async(req, res) => {
    try {
        const std = await Std.findByCredentials(req.body.email, req.body.password)
        res.send(std)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch('', async(req, res) => {
    const allowed = ['id', 'password', 'email', 'mobile']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=> {
        return allowed.includes(update)
    })
    if(!isValid){
        res.status(400).send({error:'wrong updates !!'})
    }
    try {
        const std = await Std.findById(req.body.id)
        if(!std){
            res.status(404).send()
        }
        if(req.body.email){
            std.email = req.body.email
        }
        if(req.body.password){
            std.password = req.body.password
        }
        if(req.body.mobile){
            std.mobile = req.body.mobile
        }
        await std.save()
        res.send(std)
    } catch (e) {
        res.status(400).send()
    }
})
router.delete('', async (req, res) => {
    try {
        const std = await Std.findByIdAndDelete(req.body.id)
        if(!std){
            res.status(404).send()
        }
        res.send(std)
    } catch (e) {
        res.status(400).send()
    }
})
module.exports=router