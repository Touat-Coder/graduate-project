const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const profSchema = new mongoose.Schema({
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
profSchema.statics.findByCredentials = async (email, password)=>{
    const prof = await Prof.findOne({email})
    if(!prof) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, prof.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return prof
}
profSchema.pre('save', async function(next){
    const prof= this

    if (prof.isModified('password')) {
        prof.password = await bcrypt.hash(prof.password, 8)
    }

    next()
})

const Prof = mongoose.model('Prof', profSchema)
module.exports = Prof