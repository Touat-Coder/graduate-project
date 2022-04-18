const mongoose = require('mongoose')

const projectShcema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    stdGroup: {
        
    },
    examiner: {
        type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Prof'
    },
})