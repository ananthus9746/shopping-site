var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const {
  homePage,
  viewSingleProduct,
  viewCollection,
  GetsignUp,
  signUp,
  Getlogin,
  Postlogin,
  account,
  loginWithPhoneNumber,
  logout,
} = require("../controller/user/user-helper");
const { cart } = require("../controller/user/cart-helper");

//LOGIN AND SIGN UP

const verifyLogin =(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
  }

router.get("/", homePage);

router.get("/view-single-product/:id", viewSingleProduct);

router.get("/view-collection", viewCollection);

router.get("/sign-up", GetsignUp);

router.post("/sign-up", signUp);

router.get("/login", Getlogin);

router.post("/login", Postlogin);

router.get("/account",verifyLogin, account);

router.get("/logout", logout);

router.get("/login-with-phone-number",loginWithPhoneNumber)
//==============================//

// CART

router.get("/cart",verifyLogin,cart)

module.exports = router;
