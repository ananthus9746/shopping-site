var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
const { findOne } = require("../../models/catagory");

//Getting product
exports.homePage = async (req, res) => {
  let user = req.session.user;

  console.log("USER DATA......", user);

  const product = await Product.find({}, null, { limit: 8 }).populate(
    "catagory"
  );
  if (!product) {
    console.log("No product found");
  } else {
    let products = product;
    res.render("user/index", { products, user }); //the user will go to user header partial
    //console.log("product list for home page//USER...", products,user);
  }
};

//VIEW SINGLE PRODUCT
exports.viewSingleProduct = async (req, res) => {
  let proid = req.params.id;
  console.log("Product id view single prodcut...", proid);
  const singleProduct = await Product.findById(proid);
  if (!singleProduct) {
    console.log("No product find on this id");
  } else {
    console.log("FINDED PRODUCT...", singleProduct);
    res.render("user/singleProduct", { singleProduct });
  }
};

// VIEW COLLECTION
exports.viewCollection = async (req, res) => {
  const productlist = await Product.find();
  if (!productlist) {
    console.log("No product found");
  } else {
    let pro = productlist;
    res.render("user/view-collection", { pro });
  }
};

//GETSIGNUP
exports.GetsignUp = (req, res) => {
  res.render("user/sign-up");
};

//SINGUP
exports.signUp = (req, res) => {
  console.log(req.body);
  const user = new User({
    firstName: req.body.fname,
    lastName: req.body.lastName,
    email: req.body.email,
    phone:req.body.phone,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  user
    .save()
    .then((user) => {
      console.log("DATABASE SAVED USER:..", user);
    })
    .catch((err) => {
      console.log("Not able save user to database");
    });
    
    var response = {};
    response.user = user;
    response.status = true;
  
    req.session.loggedIn = true;
    req.session.user = response.user;
  res.redirect("/");
};

// GET LOGIN
exports.Getlogin = (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {

   
    res.render("user/login",{"loginErr":req.session.loginErr}); 
    req.session.loginErr=false;
  }
};
//POSTLOGIN
exports.Postlogin = async (req, res) => {
  console.log(req.body);

  let loginStatus = false;
  let response = {};

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    response.status = false;
    console.log("No user find in this email...");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    console.log("login Sucess..");

    response.user = user;
    response.status = true;

    req.session.loggedIn = true;
    req.session.user = response.user;

    res.redirect("/");
  } else {
    console.log("password is wrong...");

    response.status = false;

    req.session.loginErr="Email or password incorrect.!";
    res.redirect("/login");
  }
};

//LOGIN WITH PHONE NUMBER
exports.loginWithPhoneNumber=(req,res)=>{

res.render('user/login-with-phone-number')

}








//ACCOUNT
exports.account = (req, res) => {
  let userdata = req.session.user;
  console.log("user data for account page...", userdata);
  res.render("user/account", { userdata });
};
//lOGOUT
exports.logout=(req,res)=>{
  req.session.loggedIn = false;
  req.session.user=null
  res.redirect('/')
}