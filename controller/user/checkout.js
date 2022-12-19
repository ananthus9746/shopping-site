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
const Order=require('../../models/order')


var userHelpers=require('../../helpers/userhelpers')



exports.shippingAddress = async (req, res) => {


let checkoutData = await userHelpers.getTotalAmount(req.session.user._id)

console.log("total....",checkoutData);

let usercart= checkoutData.usercart
let total=checkoutData.too

  res.render("user/shippingAddress",{total,usercart});
};

exports.checkout=async(req,res)=>{

let checkoutData = await userHelpers.getTotalAmount(req.session.user._id)

console.log("total....",checkoutData);

let usercart= checkoutData.usercart
let total=checkoutData.too

  res.render("user/checkout",{total,usercart})
}

exports.placeorder=async(req,res)=>{
  // console.log("place order..",req.body);
  let address=req.body;
  let paymentMethod=req.body.payment;
  // console.log("address..",address);
  // console.log("payment-method..",paymentMethod);

  let usercart = await Cart.find({ user: req.session.user });
  let checkoutData = await userHelpers.getTotalAmount(req.session.user._id)

  // console.log("place Order data....",checkoutData);
  let total=checkoutData.too
  let products=checkoutData.usercart.cartitems
  // console.log("user cart id..",usercart[0]._id)
  // console.log("cart products..",products)
  // console.log("total..",total)

  let cartid=usercart[0]._id;

  // console.log("cart id..",cartid)


  let status;
  if(paymentMethod==='Cod'){
    status='placed'
   // res.json(status=true)

  }
  else{
    status='pending'
    // res.json(response)

  }

  const order= new Order({
    user:req.session.user._id,
    cartitems:products,
    address:address,
    totalPrice:total,
    status:status
  })
  order.save().then(async(order)=>{
    console.log("saved order..",order)
    // console.log("saved order products..",order.products)

    await Cart.findOneAndRemove({ user: req.session.user });


  })
  .catch((err) => {
    console.log("order err..",err);
  });



  res.json(response)
}