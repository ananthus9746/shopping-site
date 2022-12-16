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

var userHelpers=require('../../helpers/userhelpers')


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



  let checkoutData = await userHelpers.getTotalAmount(req.session.user._id);
  console.log("total....", checkoutData);
  let too = checkoutData.too;



  const usercart = await Cart.findOne({ user: req.session.user._id })
    // .populate("user")
    .populate("cartitems.product");

  if (usercart) {
    console.log("User cart....", usercart);
    console.log("cart id....", usercart._id);

    let cartproducts = usercart.cartitems;
    let prolistLength = cartproducts.length;
    console.log("length....", prolistLength);

    if (prolistLength == 0) {
      res.render("user/cart-empty", { user: req.session.user });
    } else {
      res.render("user/cart", {
        user: req.session.user,
        usercart,
        totalQuantity,
        too,
      });
    }
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
      ).then(() => {
        res.json({ status: true }); //this staus got js-public ajax

        resolve();
      });
    } else {
      Cart.findOneAndUpdate(
        { user: req.session.user._id },
        {
          $push: {
            cartitems: proObj,
          },
        }
      ).then((response) => {
        res.json({ status: true });

        console.log("Inserted New Product Cart.", response);
        resolve();
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
  let quantity = req.body.quantity;




  if (count == -1 && quantity == 1) {
    Cart.findOneAndUpdate(
      { user: req.session.user._id },
      {
        $pull: { cartitems: { product: ObjectId(proid) } },
      }
    ).then((response) => {
      var response = false;
      res.json(response);
      console.log("product removed..");
      resolve();
    });
  } 






  else {
    Cart.findOneAndUpdate(
      { user: req.session.user._id, "cartitems.product": proid },
      {
        $inc: { "cartitems.$.quantity": count },
      }
    ).then(async() => {

      console.log("then change pro quatity..");

      let checkoutData = await userHelpers.getTotalAmount(req.session.user._id);
      console.log("from changeproquamtity.total....", checkoutData);
      let too = checkoutData.too;


 
    let response={
       status: true,
       total:too
      }



      console.log("reposnse..",response);

      res.json(response);
      resolve();
    });
  }
};















exports.removeProduct = (req, res) => {
  console.log("remove product..", req.body);

  var proid = req.params.id;

  console.log("remove pro id..", proid);

  Cart.findOneAndUpdate(
    { user: req.session.user._id },
    {
      $pull: { cartitems: { product: ObjectId(proid) } },
    }
  ).then((response) => {
    console.log("product removed 1st..");

    var response = 1;
    res.json(response);
    resolve();
  });
};
