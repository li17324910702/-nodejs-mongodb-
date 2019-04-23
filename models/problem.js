var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/problem',{useNewUrlParser: true})

var Schema = mongoose.Schema

var problemSchema = new Schema({
    problem:String,
    A:String,
    B:String,
    C:String,
    D:String,
    score:Number,
    values:Number
})


module.exports = mongoose.model('problem',problemSchema)


