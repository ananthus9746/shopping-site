var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Catagory=require('../models/catagory')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin',{admin:true})
});

router.get('/product-management', function(req, res, next) {
  res.render('admin/product-management',{admin:true})
});

router.get('/category-management', function(req, res, next) {
  res.render('admin/category-management',{admin:true})
});
 
router.post('/category-management', upload.none(), function(req, res,) {
  console.log(req.body)

  
  const catagory=new Catagory({
    name:req.body.name
  })

  catagory.save().then((catagory=>{
    console.log(catagory)
  })).catch((err)=>{
    console.log("err")
  })

});

router.post('/add-sub-catagory', function(req, res) {
  console.log(req.body)
  // res.render('admin/category-management',{admin:true})
});
router.get('/add-product', function(req, res) {
  console.log(req.body)
  res.render('admin/add-product',{admin:true})
  // res.render('admin/category-management',{admin:true})
});
router.post('/add-product', function(req, res) {
  console.log(req.body)
  
  res.render('admin/add-product',{admin:true})
});




module.exports = router;
