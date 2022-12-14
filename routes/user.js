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
  postloginWithPhoneNumber,
  otpverification,
  logout,
} = require("../controller/user/user-helper");

const { cart, addToCart,changeProductQuantity,removeProduct } = require("../controller/user/cart-helper");

//LOGIN AND SIGN UP

const verifyLogin = (req, res, next) => {
  req.user=req.session.user;
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
    console.log("login else..");      
  }
};

router.get("/", homePage);

router.get("/view-single-product/:id", viewSingleProduct);

router.get("/view-collection", viewCollection);

router.get("/sign-up", GetsignUp);

router.post("/sign-up", signUp);

router.get("/login", Getlogin);

router.post("/login", Postlogin);

router.get("/account", verifyLogin, account);

router.get("/logout", logout);

router.get("/login-with-phone-number", loginWithPhoneNumber);

router.post("/login-with-phone-number", postloginWithPhoneNumber);

router.post("/otp-verification", otpverification);

//==============================//

// CART

router.get("/cart", verifyLogin, cart);

router.post("/add-to-cart", verifyLogin, addToCart);

router.post("/change-product-quantity", verifyLogin, changeProductQuantity);

router.get("/remove-product/:id", verifyLogin,removeProduct);


module.exports = router;
