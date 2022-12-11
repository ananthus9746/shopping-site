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

exports.addToCart =  (req, res) => {
  console.log("userid..", req.session.user);
  let data = req.body;
  console.log("data.", data);
  let proObj = {
    product: data.productid,
    quantity: data.quantity,
  };

  Cart.findOne({ user: req.session.user._id })
  .exec(
    (err, usercart) => {
      if (err) {
        console.log("err");
      }
      if (usercart) {
        console.log("User cart Exits..", usercart);
        console.log("prooo..", usercart.cartitems);

        let proExist =  usercart.cartitems.find(cartitems => cartitems.product == data.productid)

       if(proExist){
        let oldq= parseInt(proExist.quantity)
        let newq=parseInt(data.quantity)

        console.log("itemadded...",proExist);
        Cart.findOneAndUpdate({"user": req.session.user._id,"cartitems.product":data.productid},{
          "$set":{
            "cartitems.$":{
              ...proObj,
              quantity:oldq+newq ,
            }
          }
        })
        .then((response) => {
          console.log("Quantiy Increased.",response);
          
      })
       }
       
       else{
        Cart.findOneAndUpdate(
          { user: req.session.user._id },
          {
            "$push": {
              "cartitems": proObj
            }
          }
        ).then((response) => {
          console.log("Inserted New Product Cart.",response);
          
      })
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
    }
  );
};


