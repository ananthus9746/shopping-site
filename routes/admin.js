var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Catagory = require("../models/catagory");
const { catagory } = require("../controller/catagory");
const {getcatagory}=require("../controller/catagory")

router.get("/", function (req, res, next) {
  res.render("admin/admin", { admin: true });
});

router.get("/product-management", function (req, res, next) {
  res.render("admin/product-management", { admin: true });
});

// router.get("/view-category-management", function (req, res, next) {
//   res.render("admin/view-category-management", { admin: true });
// });
router.get('/view-category-management',upload.none(),getcatagory)//getting added catagories

router.post("/add-catagory", upload.none(),catagory);//adding catagory







router.post("/add-sub-catagory", function (req, res) {
  console.log(req.body);
  // res.render('admin/category-management',{admin:true})
});
router.get("/add-product", function (req, res) {
  console.log(req.body);
  res.render("admin/add-product", { admin: true });
  // res.render('admin/category-management',{admin:true})
});
router.post("/add-product", function (req, res) {
  console.log(req.body);

  res.render("admin/add-product", { admin: true });
});

module.exports = router;
