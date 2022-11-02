var express = require("express");
var router = express.Router();
const multer = require("multer");
const Catagory = require("../models/catagory");
const {
  catagory,
  getcatagory,
  deletecatagory,
  catagorylist,
  editcatagory,
  updatetcatagory,
} = require("../controller/catagory");
const {
  product,
  getproduct,
  deleteproduct,
  updateproduct,
  editproduct,
} = require("../controller/product");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "public/upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", function (req, res, next) {
  res.render("admin/admin", { admin: true });
});

//CATAGORY//
router.get("/product-management", getproduct); //viewing product page

router.post("/add-catagory", upload.none(), catagory); //adding catagory

router.get("/view-category-management", upload.none(), getcatagory); //getting added catagories

router.get("/delete-catagory/:id", upload.none(), deletecatagory); //deleting selected catagory

router.get("/edit-catagory/:id", upload.none(), editcatagory); //edit catagory

router.post("/edit-catagory/:id", upload.none(), updatetcatagory); //edit catagory

//PRODUCT//
router.get("/add-product", catagorylist); //passing catagory to add product//IMPORTANT catagory need change

router.post("/add-product", upload.array("image"), product); //adding product

router.get("/delete-product/:id", upload.none(), deleteproduct); //deleting product

router.get("/edit-product/:id", upload.none(), editproduct); //deleting product

router.post("/edit-product/:id", upload.array("image"), updateproduct); //Updating product

module.exports = router;
