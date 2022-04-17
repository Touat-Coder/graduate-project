const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const stdSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true,
        trim: true
    },
    lname:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    }
})
stdSchema.statics.findByCredentials = async (email, password)=>{
    const std = await Std.findOne({email})
    if(!std) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, std.password)
    if(!isMatch){
        throw new Error('Unable to login')
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