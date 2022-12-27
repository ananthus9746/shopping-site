var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
var Cart = require("../../models/cart");
var Order = require("../../models/order");

const { findOne } = require("../../models/catagory");
// const {
//   VariableList,
// } = require("twilio/lib/rest/serverless/v1/service/environment/variable");
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

  const product = await Product.find({}, null, { limit: 8 });

  var totalQuantity = 0;
  let cart = await Cart.find({ user: req.session.user });
  if (cart) {
    console.log("cart..");
    let TotalProducts = cart[0]?.cartitems?.length;
    for (let i = 0; i < TotalProducts; i++) {
      totalQuantity = cart[0].cartitems[i].quantity + totalQuantity;
      console.log("Inside loop", i);
    }
    console.log("total quantity..", totalQuantity);
  }

  if (!product) {
    console.log("No product found");
  } else {
    let products = product;
    ///let paypalClientId='ARzWBARu7kDaaznrXbugp7ygvIdiSdsa6yulhIlUM8c6BEI0AZPAVDc8lusssEcIlipC_eAJLX-bL32G'
    res.render("user/index", {
      products,
      user,
      totalQuantity,
    });
  }
};

//VIEW SINGLE PRODUCT
exports.viewSingleProduct = async (req, res) => {
  var totalQuantity = 0;
  let cart = await Cart.find({ user: req.session.user });
  if (cart) {
    console.log("cart..");
    let TotalProducts = cart[0]?.cartitems?.length;
    for (let i = 0; i < TotalProducts; i++) {
      totalQuantity = cart[0].cartitems[i].quantity + totalQuantity;
      console.log("Inside loop", i);
    }
    console.log("total quantity..", totalQuantity);
  }

  let proid = req.params.id;
  console.log("Product id view single prodcut...", proid);
  const singleProduct = await Product.findById(proid);
  if (!singleProduct) {
    console.log("No product find on this id");
  } else {
    console.log("FINDED PRODUCT...", singleProduct);
    res.render("user/singleProduct", {
      singleProduct,
      user: req.session.user,
      totalQuantity,
      clientId:'ARzWBARu7kDaaznrXbugp7ygvIdiSdsa6yulhIlUM8c6BEI0AZPAVDc8lusssEcIlipC_eAJLX-bL32G'
    });
  }
};

// VIEW COLLECTION
exports.viewCollection = async (req, res) => {
  const productlist = await Product.find();
  if (!productlist) {
    console.log("No product found");
  } else {
    let pro = productlist;
    res.render("user/view-collection", {
      pro,
      user: req.session.user,
    });
  }
};

//GETSIGNUP
exports.GetsignUp = (req, res) => {
  res.render("user/sign-up", { SignUpErr: req.session.SignUpErr });
  req.session.SignUpErr = false;
};

//POST SINGUP
exports.signUp = async (req, res) => {
  // console.log("user data..", req.body);
  var userdata = await User.find({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  })
    .then((user) => {
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
        req.session.SignUpErr =
          "User already exits with this email and phone number";
        console.log("user already exits..");
        res.redirect("/sign-up");
      }
    })
    .catch((err) => {
      console.log("some error in user signup", err);
    });

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
    console.log("loggedin..");
  } else {
    res.render("user/login", {
      loginErr: req.session.loginErr,
      BlockedErr: req.session.userBlockedErr,
    });
    req.session.loginErr = false;
    req.session.userBlockedErr = false;
  }
};
//POSTLOGIN
exports.Postlogin = async (req, res) => {
  console.log("post login data...", req.body);

  let loginStatus = false;
  let response = {};

  const user = await User.findOne({ email: req.body.email });

  console.log("finded user..", user);
  if (!user) {
    response.status = false;
    console.log("No user find in this email...");
    var userdata = 0;
  }
  if (userdata == 0) {
    response.status = false;
    req.session.loginErr = "Email or password incorrect.!";
    res.redirect("/login");
  } else {
    if (user.blocked) {
      console.log("You have been blocked..");
      req.session.loggedIn = false;
      req.session.user = null;
      req.session.userBlockedErr = "You have been blocked.!";
      res.redirect("/login");
    } else {
      console.log("welcome");

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
exports.account = async (req, res) => {
  let userdata = req.session.user;
  let NoOrder = false;

  var orderlist=await Order.deleteMany({status:"payment-failed"})
  await Order.deleteMany({status:"OnlineProcesing"})

  

  var latestAddress;
  var order = await Order.find({ user: req.session.user._id })
    .populate("cartitems.product")
    .sort({ dateCreated: -1 });
  if (order.length != 0) {
    latestAddress = order[0].address;
  } else {
    console.log("NO order founded..");
    NoOrder = true;
  }
  console.log("latestAddress", latestAddress);
  res.render("user/account", { userdata, NoOrder, order, latestAddress });
};

//lOGOUT
exports.logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect("/");
};












  // let cart = await Cart.find({ user: req.session.user._id })
  // if (cart.length != 0) {
  //   var cartid = cart[0]._id.toString();
  //   for (var i = 0; i < order.length; i++) {
  //     var orderid = order[0].cartid.toString();
  //     // console.log("order each..");
  //     if (cartid === orderid) {
  //       console.log("cart equal to order id..");
  //       order = await Order.findOneAndRemove({ cartid: cartid });
  //     } else {
  //       console.log("not equal..");
  //     }
  //   }
  // }


  // console.log("Cart items for account...",order[0].cartitems)
    // console.log("latest address..",order[0].address)
    // console.log("Order...",order)
    // console.log('order cartids..',order[0].cartid)






//  // console.log("cart from accont..",cart)
//   // console.log("cart id..",cart[0]._id)
//   let cartid=cart[0]._id

//   if(cart){
//     order.forEach(order => {
//      // console.log('order each..',order.cartid)
//       if(cartid===order.cartid){
//         console.log("cart equal to order id..")
//       }
//     });
//    }

// if (cart) {
//   order.forEach((order) => {
//     console.log("var..cartid",cartid)
//     if (cartid === order.cartid) {
//       console.log("cart equal to order id..");
//     }
//     else{
//       console.log("not equal..")
//     }
//     console.log("order each..", order.cartid);
//   });
// }
