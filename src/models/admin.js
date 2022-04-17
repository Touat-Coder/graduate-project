const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
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
adminSchema.statics.findByCredentials = async (email, password)=>{
    const admin = await Admin.findOne({email})
    if(!admin) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return admin
}
adminSchema.pre('save', async function(next){
    const admin= this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin