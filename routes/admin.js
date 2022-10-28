var express = require("express");
var router = express.Router();
const multer = require("multer");
const Catagory = require("../models/catagory");
const {catagory,getcatagory,deletecatagory,catagorylist} = require("../controller/catagory");
const {product}=require('../controller/product');
const shortid = require("shortid");
const path =require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname),'upload'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() +'-'+file.originalname)
  }
})
const upload = multer({ storage});

router.get("/", function (req, res, next) {
  res.render("admin/admin", { admin: true });
});
router.get("/product-management", function (req, res, next) {
  res.render("admin/product-management", { admin: true });
});


router.post("/add-catagory", upload.none(),catagory);//adding catagory

router.get('/view-category-management',upload.none(),getcatagory)//getting added catagories

router.get('/delete-catagory/:id',upload.none(),deletecatagory)//deleting selected catagory

router.get("/add-product",catagorylist)

router.post("/add-product",upload.array('image'),product)//adding product














// router.post("/add-sub-catagory", function (req, res) {
//   console.log(req.body);
//   // res.render('admin/category-management',{admin:true})
// });





module.exports = router;
