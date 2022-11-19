var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { homePage,viewSingleProduct,viewCollection } = require("../controller/user/user-helper");






router.get("/", homePage)

router.get("/view-single-product/:id",viewSingleProduct)


router.get("/view-collection",viewCollection)




router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login", (req, res) => {
  console.log(req.body);
});

router.get("/sign-up", (req, res) => {
  res.render("user/sign-up");
});

router.post("/sign-up", (req, res) => {
  console.log(req.body);
});



module.exports = router;
