const express = require('express')
const Admin = require('../models/admin')
const router = new express.Router()

router.get('', async (req,res) => {
    try {
        const admin =await Admin.find()
        res.json(admin)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}) 
router.post('', async(req,res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save()
        res.json(admin)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

module.exports=router