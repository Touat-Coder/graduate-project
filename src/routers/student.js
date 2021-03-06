const express = require('express')
const Std = require('../models/student')
const multer = require('multer')
const xlsx = require('xlsx')
const router = new express.Router()

router.get('/master', async (req,res) => {
    try {
        const std =await Std.find({group: 'Info_M'})
        res.json(std)
    } catch (e) {
        res.status(400).json(e)
    }
})
router.get('/licence', async (req,res) => {
    try {
        const std =await Std.find({group: 'Info_L'})
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
    const wb = xlsx.readFile('./lists/'+req.file.originalname)
    const ws = wb.Sheets['G1']
    const data = xlsx.utils.sheet_to_json(ws)
    var list=[];
    try {
        data.map((i) => {
            const std = new Std(i)
            std.save()
            list.push(std)
        })
        res.status(201).json(list)
    } catch (e) {
        res.status(400).json(e)
    }
    
})

module.exports=router