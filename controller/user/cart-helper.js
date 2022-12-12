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

// GET CART PRODUCT DTAILS

exports.cart = async (req, res) => {
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

  const usercart = await Cart.findOne({ user: req.session.user._id })
    // .populate("user")
    .populate("cartitems.product");

  if (usercart) {
    console.log("User cart....", usercart);
    console.log("cart id....", usercart._id);
    // let cartid=usercart._id;

    // let cartproducts = usercart.cartitems;
    // console.log("cart product lists....", cartproducts);
    // console.log(
    //   "Taking Single product from product list....",
    //   cartproducts[0].product
    // );
    // console.log("Taking Sin...", cartproducts[0].product.name);

    // res.send({ status: 200, data: { usercart } });

    res.render("user/cart", {
      user: req.session.user,
      usercart,
      totalQuantity,
    });
  } else {
    res.render("user/cart-empty");
  }
};

// ADD TO CART

exports.addToCart = async (req, res) => {
  console.log("userid..", req.session.user);
  let data = req.body;
  console.log("data.", data);
  let proquantity = parseInt(data.quantity);

  let proObj = {
    product: data.productid,
    quantity: proquantity,
  };

  let usercart = await Cart.findOne({ user: req.session.user._id });

  if (usercart) {
    let proExist = usercart.cartitems.findIndex(
      (cartitems) => cartitems.product == data.productid
    );
    console.log("proExits..", proExist);
    if (proExist != -1) {
      //its mean 0 pro exist in someWhere in in cartitem Array

      Cart.findOneAndUpdate(
        { user: req.session.user._id, "cartitems.product": data.productid },
        {
          $inc: { "cartitems.$.quantity": proquantity },
        }
      ).then(()=>{

        res.json({ status: true });//this staus got js-public ajax

        resolve()
        
      })
    } else {
      Cart.findOneAndUpdate(
        { user: req.session.user._id },
        {
          $push: {
            cartitems: proObj,
          },
        }
      ).then((response) => {
        console.log("Inserted New Product Cart.", response);
      });
    }
  } else {
    const cart = new Cart({
      user: req.session.user._id,
      cartitems: [proObj],
    });

    cart.save((err, cart) => {
      if (err) {
        console.log("A Error in Saving cart..", err);
      } else {
        console.log("Saved Cart to database...", cart);
        res.json({ status: true });
      }
    });
  }

};

exports.changeProductQuantity = (req, res) => {
  console.log("call from change product quantity..", req.body);

  let proid = req.body.proId;
  let count = req.body.count;



  Cart.findOneAndUpdate(
    { user: req.session.user._id, "cartitems.product": proid },
    {
      $inc: { "cartitems.$.quantity": count },
    }
  ).then(()=>{

   let response =true

    res.json(response)

    resolve()
  })


};
