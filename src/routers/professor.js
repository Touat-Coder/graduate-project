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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./lists")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: fileStorage})

router.post('/list', upload.single('proflist'), (req, res) => {
    console.log(req.file.originalname)
    const wb = xlsx.readFile('./lists/'+req.file.originalname)
    const ws = wb.Sheets['G1']
    const data = xlsx.utils.sheet_to_json(ws)
    var list = []
    try {
        data.map((i) => {
            const prof = new Prof(i)
            prof.save()
            list.push(prof)
        })
        res.json(list)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
    
})
module.exports=router