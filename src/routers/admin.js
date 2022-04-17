const express = require('express')
const Admin = require('../models/student')
const router = new express.Router()

router.get('', async (req,res) => {
    try {
        const admin =await Admin.find()
        res.send(admin)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}) 
router.post('', async(req,res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save()
        res.send(admin)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.post('/login', async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        res.send(admin)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
module.exports=router