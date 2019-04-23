var express = require('express')
var users = require('./models/users')
var problem_d = require('./models/problem')
var md5 = require('md5');



var router=express.Router()

router
    .get('/',function (req,res) {
        if (req.session.user){
            var name=null
            name=req.session.user.name
            problem_d.find(function (err,data) {
                res.render('index.html',{
                    data:data,
                    name:name
                })
            })
        }else{
            res.redirect('/login')
        }
    })
    .get('/login',function (req,res) {
        res.render('login.html')
    })
    .post('/login',function (req,res) {
        req.body.password=md5(req.body.password)
        req.body.id=parseInt(req.body.id)

        users.findOne({
            id:req.body.id,
            password:req.body.password
        },function (err,user) {

            if(err)
               return next(err)
            else if(user){

                req.session.user=user
                res.status(200).json({
                    err_code:0,
                    message:'ok'
                })
            }else{
                res.status(200).json({
                    err_code:2,
                    message:'id or password is invalid'
                })
            }
        })
    })
    .get('/register',function (req,res) {
        res.render('register.html')
    })
    .post('/register',function (req,res) {
        req.body.password=md5(req.body.password)
        req.body.id=parseInt(req.body.id)
        users.findOne({id:req.body.id},function(err,data) {
                if(err)
                    return next(err)
                 else if(data) {
                     return res.status(200).json({
                        err_code: 1,
                        message: 'OK'
                    })
                }
            new users(req.body).save(function (err,data) {
                if(err)
                    return next(err)
                req.session.user=data
                res.status(200).json({
                    err_code: 0,
                    message: 'OK'
                })

            })
        })

    })
    .get('/admin/new',function (req,res) {
        var problem_one =req.query
        problem_one.values=parseInt(problem_one.values)
        new problem_d(problem_one).save(function (err) {
            if(err)
                return next(err)
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })


        })
    })
    .get('/admin',function (req,res) {
       problem_d.find(function (err,problem) {
           if(err)
              return next(err)

           res.render('admin.html',{
               problems:problem
           })
       })


    })
    .get('/admin/edit',function (req,res) {
        var problem_one =req.query
        problem_one.values=parseInt(problem_one.values)

        problem_d.findByIdAndUpdate(problem_one._id,problem_one,function (err) {
            if (err)
                return next(err)
            res.redirect('/admin')
        })
    })
    .get('/admin/delete',function (req,res) {

        problem_d.findByIdAndRemove(req.query._id.replace(/"/g,''),function (err) {
            if(err)
                return next(err)
            res.redirect('/admin')
        })
    })
    .get('/student',function (req,res) {
        var p1=new Promise(function (resolve,reject) {
            problem_d.find(function (err,data) {
                if(err)
                    return next(err)
                resolve(data)
            });
        })
        p1.
            then(function (data) {
                if(req.session.user){
                    users.findById(req.session.user._id,function (err,student) {
                        var count=0
                        if(err)
                            return next(err)
                        var ob={}
                        for(let i of data) {
                            ob[i._id] = i.values
                        }
                        data=ob
                        var answer=student.answer[student.answer.length-1]
                        for(let i in answer) {

                            if(answer[i]===data[i]){

                                count++

                            }
                        }
                        res.render('student.html',{
                            count:count,
                            data:data,
                            answer:answer
                        })
                    })
                }else {
                    res.redirect("/login")
                }

            })



    })
    .post('/commit',function (req,res) {
        var user=req.session.user
        var answer=req.body
        for(let i in answer ){
            answer[i]=parseInt(answer[i])
        }

        users.findByIdAndUpdate(user._id, {
                    $push:{answer:answer}
                },function (err) {
            if(err)
                    return next(err)
            res.status(200).json({
                err_code:0,
                message: 'sucess'
            })
        })
    })
    .get('/loginout',function (req,res) {
        req.session.user=''
        res.redirect('/')
    })








module.exports=router