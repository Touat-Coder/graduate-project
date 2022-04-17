const express = require('express')
const Prof = require('../models/professor')
const router = new express.Router()

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
router.post('/login', async(req, res) => {
    try {
        const prof = await Prof.findByCredentials(req.body.email, req.body.password)
        res.send(prof)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
module.exports=router