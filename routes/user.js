var express = require('express');
var router = express.Router();
const MongoClient=require('mongodb').MongoClient

router.get('/', function(req, res, next) {  
  res.render('user/index', {admin:false});
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.post('/login',(req,res)=>{
  console.log(req.body)
})

router.get('/sign-up',(req,res)=>{
  res.render('user/sign-up')
})

router.post('/sign-up',(req,res)=>{
  console.log(req.body)
})



module.exports = router;
