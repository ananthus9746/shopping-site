var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
const { findOne } = require("../../models/catagory");
const Cart = require("../../models/cart");
const { ObjectId } = require("mongodb");

// GET CART PRODUCT DTAILS

exports.cart = async (req, res) => {
  const usercart = await Cart.findOne({ user: req.session.user._id })
    .populate("user")
    .populate("cartitems.product");

  if (usercart) {
    console.log("User cart....", usercart);

    console.log("cart product lists....", usercart.cartitems);

    // res.send({ status: 200, data: { usercart } });

    res.render("user/cart", { user: req.session.user });
  } else console.log("no carts found..");
};

// ADD TO CART

exports.addToCart = async (req, res) => {
  console.log("userid..", req.session.user);
  let data = req.body;

  Cart.findOne({ user: req.session.user._id }).exec((err, cart) => {
    if (err) {
      console.log("Error cart..");
    }
    if (cart) {
      console.log(
        "USER CART FINDED NOW UPDATING CART QUANTITY or INSERTING NEW PRODUCT.."
      );
    } else {
      const cart = new Cart({
        user: req.session.user._id,
        cartitems: [
          {
            product: data.productid,
            quantity: data.quantity,
          },
        ],
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
  });
};
