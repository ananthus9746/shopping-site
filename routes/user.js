var express = require('express');
var router = express.Router();
const MongoClient=require('mongodb').MongoClient

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('user/index', {admin:false});
});

router.get('/account',(req,res)=>{
  res.render('user/account')
})

module.exports = router;
