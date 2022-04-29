const mongoose = require('mongoose')

const projectShcema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    encadreur: {
        type: String,
        trim: true,
        required: true
    },
})
const Project = mongoose.model('Project', projectShcema)
module.exports = Project