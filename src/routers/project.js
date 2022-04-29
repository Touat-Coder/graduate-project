const express = require('express')
const Project = require('../models/project')
const multer = require('multer')
const xlsx = require('xlsx')
const router = new express.Router()


router.get('/projects', async (req,res) => {
    try {
        const project =await Project.find()
        res.json(project)
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

router.post('/projects', upload.single('projet'), (req, res) => {
    console.log(req.file.originalname)
    const wb = xlsx.readFile('./lists/'+req.file.originalname)
    const ws = wb.Sheets['G1']
    const data = xlsx.utils.sheet_to_json(ws)
    var list=[];
    try {
        data.map((i) => {
            const project = new Project(i)
            project.save()
            list.push(project)
        })
        res.status(201).json(list)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
    
})

module.exports=router