
//import mongoose
const mongoose=require('mongoose')

//define connection string with Mongodb and server
mongoose.connect('mongodb://localhost:27017/bankserver',{useNewUrlParser:true})

//creat a model to perform operations your server and mongodb
const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}