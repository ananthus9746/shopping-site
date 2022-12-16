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



exports.checkout = async (req, res) => {


let checkoutData = await userHelpers.getTotalAmount(req.session.user._id)

console.log("total....",checkoutData);

let usercart= checkoutData.usercart
let too=checkoutData.too

  res.render("user/checkout",{too,usercart});
};
