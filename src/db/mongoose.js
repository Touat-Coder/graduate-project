const mongoose = require('mongoose')
const url = 'mongodb+srv://taskapp:19991999@cluster0.q88ch.mongodb.net/Graduate?retryWrites=true&w=majority'
mongoose.connect(url,{
    useNewUrlParser: true,
}, ()=>{
    console.log('mongo is connected')
})