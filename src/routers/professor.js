const express = require('express')
const Prof = require('../models/professor')
const router = new express.Router()
const multer = require('multer')
const xlsx = require('xlsx')

router.get('', async (req,res) => {
    try {
        const prof =await Prof.find()
        res.json(prof)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}) 
router.post('', async(req,res) => {
    const prof = new Prof(req.body)
    try {
        await prof.save()
        res.json(prof)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

router.post('/login', async(req, res) => {
    try {
        const prof = await Prof.findByCredentials(req.body.email, req.body.password)
        res.json(prof)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})
router.patch('', async(req, res) => {
    if(!req.body.id){
        res.status(404).json({Error: 'provid an id please !!'})
    }
    try {
        const allowed = ['password', 'id', 'email', 'emailWork']
        const apdates = Object.keys(req.body)
        const isvalid = apdates.every((apdate) => {
            return allowed.includes(apdate)
        })
        if(!isvalid)
            res.status(400).json({Error: 'invalid updates !!'})

        const prof = await Prof.findById(req.body.id)

        if(!prof)
            res.status(404).json()

        if(req.body.password)
            prof.passowrd = req.body.passowrd

        if(req.body.email)
            prof.email = req.body.email

        if(req.body.emailWork) 
            prof.emailWork = req.body.emailWork
        
        await prof.save()
        res.json(prof)
    } catch (e) {
        res.status(400).json()
    }
})
router.delete('', async(req, res) => {
    try {
        const prof = await Prof.findByIdAndDelete(req.body.id)
        if(!prof)
            res.status(400).json()
        
        res.json(prof)
    } catch (e) {
        res.status(500).json()
    }
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./lists")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: fileStorage})

router.post('/list', upload.single('proffile'), (req, res) => {
    console.log(req.file.originalname)
    const wb = xlsx.readFile('./lists/'+req.file.originalname)
    const ws = wb.Sheets['G1']
    const data = xlsx.utils.sheet_to_json(ws)
    try {
        data.map((i) => {
            const prof = new Prof(i)
            prof.save()
        })
        res.json(data)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
    
})
module.exports=router