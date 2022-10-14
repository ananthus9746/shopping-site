var express = require('express');
var router = express.Router();
const MongoClient=require('mongodb').MongoClient

/* GET home page. */
router.get('/', function(req, res, next) {
  product=[{ 
    name:"Nokia",
    price:6000,
    discription:"This is a good product ",
    image:"https://cdn.thewirecutter.com/wp-content/media/2021/08/budget-android-phone-2048px-nord-front.jpg"
  },
  {
    name:"andriond",
    price:1000,
    discription:"This is a good product ",
    image:"https://cdn.thewirecutter.com/wp-content/media/2021/08/budget-android-phone-2048px-nord-front.jpg"
  }]

  MongoClient.connect('mongodb://localhost:27017',function(err,client){
    if(err){
      console.log(err,"There is a erorr")
    }
    else{
      console.log('data base connected')
    }
    client.db('newdb').collection('product').insertMany(product)
  })

  
  res.render('user/index', {product,admin:false});
});

module.exports = router;
