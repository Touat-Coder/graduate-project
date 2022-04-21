const express = require('express')
const Std = require('../models/student')
const multer = require('multer')
const xlsx = require('xlsx')
const router = new express.Router()

router.get('', async (req,res) => {
    try {
        const std =await Std.find()
        res.json(std)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}) 
router.post('', async(req,res) => {
    const std = new Std(req.body)
    try {
        await std.save()
        res.json(std)
    } catch (e) {
        res.status(400).json(e)
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

router.post('/list', upload.single('stdfile'), (req, res) => {
    console.log(req.file.originalname)
    const wb = xlsx.readFile('./lists/'+req.file.originalname)
    const ws = wb.Sheets['G1']
    const data = xlsx.utils.sheet_to_json(ws)
    try {
        data.map((i) => {
            const std = new Std(i)
            std.save()
        })
        res.json(data)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
    
})

router.post('/login', async(req, res) => {
    try {
        const std = await Std.findByCredentials(req.body.email, req.body.password)
        res.json(std)
    } catch (e) {
        res.status(400).json(e)
    }
})
router.patch('', async(req, res) => {
    const allowed = ['id', 'password', 'email', 'mobile']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=> {
        return allowed.includes(update)
    })
    if(!isValid){
        res.status(400).json({error:'wrong updates !!'})
    }
    try {
        const std = await Std.findById(req.body.id)
        if(!std){
            res.status(404).json()
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
        res.json(std)
    } catch (e) {
        res.status(400).json()
    }
})
router.delete('', async (req, res) => {
    try {
        const std = await Std.findByIdAndDelete(req.body.id)
        if(!std){
            res.status(404).json()
        }
        res.json(std)
    } catch (e) {
        res.status(400).json()
    }
})
module.exports=router