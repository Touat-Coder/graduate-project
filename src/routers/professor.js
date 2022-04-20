const express = require('express')
const Prof = require('../models/professor')
const router = new express.Router()
const upload = require('express-fileupload')
const xlsx = require('xlsx')

router.get('', async (req,res) => {
    try {
        const prof =await Prof.find()
        res.send(prof)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}) 
router.post('', async(req,res) => {
    const prof = new Prof(req.body)
    try {
        await prof.save()
        res.send(prof)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.post('/list', async (req,res) => {
    try {
        const file = req.files.proffile

        if(!file.name.match(/\.(xls|xlsx)$/))
            res.status(400).send('plese enter an excel file')
        await file.mv('./lists/'+ file.name, (err, result) => {
            if (err) throw err

            //read excel file
            const wb = xlsx.readFile('./lists/'+ file.name)
            const ws = wb.Sheets['G1']
            // convert the data of the file to json
            const profJson = xlsx.utils.sheet_to_json(ws)
            // const newdata = stdJson.map((i) => i.name)
            const list = profJson.map((i) => {
        
                    const prof =  new Prof(i)
                    prof.save()
                    console.log(prof)
                
            })
        })
        const prof = await Prof.find()
        res.send(prof)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.post('/login', async(req, res) => {
    try {
        const prof = await Prof.findByCredentials(req.body.email, req.body.password)
        res.send(prof)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.patch('', async(req, res) => {
    if(!req.body.id){
        res.status(404).send({Error: 'provid an id please !!'})
    }
    try {
        const allowed = ['password', 'id', 'email', 'emailWork']
        const apdates = Object.keys(req.body)
        const isvalid = apdates.every((apdate) => {
            return allowed.includes(apdate)
        })
        if(!isvalid)
            res.status(400).send({Error: 'invalid updates !!'})

        const prof = await Prof.findById(req.body.id)

        if(!prof)
            res.status(404).send()

        if(req.body.password)
            prof.passowrd = req.body.passowrd

        if(req.body.email)
            prof.email = req.body.email

        if(req.body.emailWork) 
            prof.emailWork = req.body.emailWork
        
        await prof.save()
        res.send(prof)
    } catch (e) {
        res.status(400).send()
    }
})
router.delete('', async(req, res) => {
    try {
        const prof = await Prof.findByIdAndDelete(req.body.id)
        if(!prof)
            res.status(400).send()
        
        res.send(prof)
    } catch (e) {
        res.status(500).send()
    }
})
module.exports=router