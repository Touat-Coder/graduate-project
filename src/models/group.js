const mongoose = require('mongoose')

const groupSchema= new mongoose.Schema({
    std1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Std'
    },
    std2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Std'
    },
    std3:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Std'
    },
    rank:{
        type: Number
    }
})
const Group = mongoose.model('Group', groupSchema)
module.exports = Group