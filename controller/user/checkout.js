var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
const { findOne } = require("../../models/catagory");
const Cart = require("../../models/cart");
const { ObjectId } = require("mongodb");
const { resolve } = require("path");
const { response } = require("express");

exports.checkout = async (req, res) => {
  const usercart = await Cart.findOne({ user: req.session.user._id })
    // .populate("user")
    .populate("cartitems.product", "price")
    .populate("cartitems.product")




  if (usercart) {
    // console.log("checkout....", usercart);
    // console.log("cart id....", usercart._id);

    let cartproducts = usercart.cartitems;

    let prolistLength = cartproducts.length;

    console.log("length....", prolistLength);

    console.log("cartproducts....", cartproducts);

    var arr=[]

    for (let i = 0; i < prolistLength; i++) {

      var price = cartproducts[i].product.price
      var quantity =cartproducts[i].quantity

        var total=price*quantity
      
        console.log("price..",price);
        console.log("quantity..",quantity);
        console.log("total..",total);


      

         totalPrice = cartproducts[i].product.price * cartproducts[i].quantity;
         arr.push(totalPrice)




    }
    console.log("totalPrice22..",arr);

    let TotalCartValue = arr.reduce((a,b) => a +b , 0)

    console.log("SUM ...",TotalCartValue);

    var too=TotalCartValue;





console.log("tooo",too);

    



  } else {
    console.log("NO cart found");
  }

  res.render("user/checkout",{usercart,too, user: req.session.user,});
};
