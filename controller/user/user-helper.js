var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");

const { findOne } = require("../../models/catagory");
// const firebase = require("../../otpauthentication/firebase");
// require("firebase/auth");
// require("firebase/firestore");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

//Getting product
exports.homePage = async (req, res) => {
  let user = req.session.user;

  // if(req.session.userBlockedErr ){
  //   let user = req.session.null;
  // }

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
  res.render("user/sign-up", { SignUpErr: req.session.SignUpErr });
  req.session.SignUpErr = false;
};

//SINGUP
exports.signUp = async (req, res) => {
  // console.log("user data..", req.body);
  var userdata = await User.find({ email: req.body.email }).then((user) => {
    console.log("finded user", user);
    if (user.length == 0) {
      console.log("welcome");
      // console.log(req.body);

      const user = new User({
        firstName: req.body.fname,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
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
    } else {
      req.session.SignUpErr = "user already exits with this email";
      console.log("user already exits..");
      res.redirect("/sign-up");
    }
  }).catch((err)=>{
    console.log("some error in user signup",err)
  })

  // var userPhone = await User.find({ phone: req.body.phone });

  //  else {
  //   email = true;
  //   console.log("no user with emial found...");
  //   console.log(" no user email:true", email);

  // }

  // if (userPhone) {
  //   phone = false;
  //   console.log("user found with phone...", userPhone);
  //   console.log("no phone:false", phone);
  // } else {
  //   phone = true;
  //   console.log("no user found with phone...");
  //   console.log("no phone:true", phone);

  // }

  // if (email && phone === true) {
  //   console.log("User Verified Sucessfully.");
  // } else {
  //   console.log("Rejected..");
  //   console.log("email:", email);
  //   console.log("phone:", phone);
  // }
};

// GET LOGIN
exports.Getlogin = (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr ,BlockedErr:req.session.userBlockedErr});
    req.session.loginErr = false;
    req.session.userBlockedErr=false
  }
};
//POSTLOGIN
exports.Postlogin = async (req, res) => {
  console.log(req.body);

  let loginStatus = false;
  let response = {};

  const user = await User.findOne({ email: req.body.email });

  console.log("finded user..",user);

  console.log("status...",user.blocked);

  if(user.blocked==true){
    
    console.log("You have been blocked..");
    req.session.userBlockedErr = "You have been blocked.!";
    res.redirect("/login");
  }
  else{
    console.log("welcome");

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

    req.session.loginErr = "Email or password incorrect.!";
    res.redirect("/login");
  }
  }
};

//LOGIN WITH PHONE NUMBER
exports.loginWithPhoneNumber = (req, res) => {
  res.render("user/login-with-phone-number", {
    otpErr: req.session.otploginErr,
  });

  req.session.otploginErr = false;
};

exports.postloginWithPhoneNumber = async (req, res) => {
  console.log("postlginwithphonenuber..", req.body);
  phonenumber = req.body.phone;
  console.log("parsint...", phonenumber);
  let user = await User.findOne({ phone: req.body.phone });
  console.log("userr", user);
  if (!user) {
    req.session.otploginErr = "No user find in this phone number.!";
    console.log("No user find in this phone number...");

    res.redirect("/login-with-phone-number");
  } else {
    // const { phone } = req.body;
    let user_number = req.body.phone;
    console.log("mobile number finded sucessdully..", user_number);
    console.log(user_number);
    User_number = user_number;
    client.verify.services(process.env.SERVICE_SID).verifications.create({
      to: `+91${user_number}`,
      channel: "sms",
    });
    res.render("user/otp");
  }
};

exports.otpverification = (req, res) => {
  console.log("otp-verification..", req.body);

  const { otp } = req.body;

  console.log("user_number..", User_number);

  client.verify
    .services(process.env.SERVICE_SID)
    .verificationChecks.create({
      to: `+91${User_number}`,
      channel: "sms",
      code: otp,
    })
    .then(async (resp) => {
      if (resp.valid == false) {
        req.session.otp = true;
        let otpvalidation = req.session.otp;
      } else if (resp.valid == true) {
        let user = await User.findOne({ phone: User_number });

        console.log("user after otp validatin...", user);

        var response = {};
        response.user = user;
        response.status = true;

        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      }
    });
};

//ACCOUNT
exports.account = (req, res) => {
  let userdata = req.session.user;
  console.log("user data for account page...", userdata);
  res.render("user/account", { userdata });
};
//lOGOUT
exports.logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect("/");
};
