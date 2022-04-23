const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const profSchema = new mongoose.Schema({
    name:{
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
    emailWork:{
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        //professor123
        default: '$2a$08$YU4eWkbq0XTlR0xUHx1IsOW4FQwiIlFfWJSnkbh2WnFlePV76W4Y2',
        minlength: 8,
        trim: true
    },
    role: {
        type: String,
        default: 'prof'
    }
})
profSchema.statics.findByCredentials = async (email, password)=>{
    const prof = await Prof.findOne({email})
    if(!prof) {
        return({error:'unable to login'})
    }
    const isMatch = await bcrypt.compare(password, prof.password)
    if(!isMatch){
        return({error:'unable to login'})
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