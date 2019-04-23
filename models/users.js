var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/answer',{useNewUrlParser: true})

var Schema = mongoose.Schema

var userSchema = new Schema({
    name:String,
    id:Number,
    password:String,
    answer:[Object]
})


module.exports = mongoose.model('user',userSchema)


