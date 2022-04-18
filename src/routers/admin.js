const express = require('express')
const Admin = require('../models/admin')
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

        const admin = await Admin.findById(req.body.id)

        if(!admin)
            res.status(404).send()

        if(req.body.password)
            admin.passowrd = req.body.passowrd

        if(req.body.email)
            admin.email = req.body.email

        if(req.body.emailWork) 
            admin.emailWork = req.body.emailWork
        
        await admin.save()
        res.send(admin)
    } catch (e) {
        res.status(400).send()
    }
})
module.exports=router