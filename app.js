var express = require ('express')
var bodyparse=require('body-parser')
var router=require('./route')
var session=require('express-session')


var app=express()





app.use('/public/',express.static('./public/'))
app.use('/node_modules/',express.static('./node_modules/'))
app.engine('html', require('express-art-template'));
app.use(session({
    secret: 'sssss',
    resave: false,
    saveUninitialized: true
}))
app.use(bodyparse.urlencoded({ extends:false }))
app.use(bodyparse.json())

app.use(router)

app.use(function (req, res) {
    res.render('404.html')
})

app.use(function (err,req,res,next) {
    console.log(err)
    res.status(500).json({
        err_code:500,
        message:err.message
    })
})



app.listen(3000,function () {
    console.log('running')
})

