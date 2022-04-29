const express = require('express')
const Admin = require('../models/admin')
const Group = require('../models/group')
const Std = require('../models/student')
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
router.post('/group', async (req, res) => {
    const group = new Group(req.body)
    try {
        await group.save()
        let boss
        let students = []
        students[0] = await Std.findById(req.body.std1)
        boss=students[0]
        if(req.body.std2){
            students[1] = await Std.findById(req.body.std2)
            if(boss.rank > students[1].rank) boss=students[1]
        }
            
        if(req.body.std3){
            students[2] = await Std.findById(req.body.std3)
            if(boss.rank > students[2].rank) boss=students[2]
        }
        group.rank = boss.rank
        group.boss= boss._id
        await group.save()
        res.json(group)
    } catch (e) {
        res.status(400).json()
    }
})
router.post('/groups', async (req, res) => {
    let i=0
    var list = []
    while(req.body[i]){
        const group = new Group(req.body[i])
        await group.save()
        let boss
        let students = []
        students[0] = await Std.findById(req.body[i].std1)
        boss=students[0]
        if(req.body[i].std2){
            students[1] = await Std.findById(req.body[i].std2)
            if(boss.rank > students[1].rank) boss=students[1]
        }
            
        if(req.body[i].std3){
            students[2] = await Std.findById(req.body[i].std3)
            if(boss.rank > students[2].rank) boss=students[2]
        }
        group.rank = boss.rank
        group.boss= boss._id
        await group.save()
        list.push(group)
        i++
    }
    res.json(list)
})

module.exports=router