const express = require('express')
const Std = require('../models/student')
const router = new express.Router()

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
router.post('/login', async(req, res) => {
    try {
        const std = await Std.findByCredentials(req.body.email, req.body.password)
        res.send(std)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
module.exports=router