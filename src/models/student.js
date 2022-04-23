const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const stdSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        //student123
        default: "$2a$08$rzWQ2ndgprzovFhtcLhYyehPkFyZFtPA0Oyf7Wq6I/m7FKGyrke2a",
        minlength: 8,
        trim: true
    },
    rank:{
        type: Number,
    },
    matricule:{
        type: String,
        unique: true
    },
    role: {
        type: String,
        default:'student'
    },
    group:{
        type: String
    }
})
stdSchema.statics.findByCredentials = async (email, password)=>{
    const std = await Std.findOne({email})
    if(!std) {
        return({error:'unable to login'})
    }
    const isMatch = await bcrypt.compare(password, std.password)
    if(!isMatch){
        return({error:'unable to login'})
    }
    return std
}
stdSchema.pre('save', async function(next){
    const std= this

    if (std.isModified('password')) {
        std.password = await bcrypt.hash(std.password, 8)
    }

    next()
})

const Std = mongoose.model('Std', stdSchema)
module.exports = Std