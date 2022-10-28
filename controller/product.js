const Product = require("../models/product");
var express = require("express");
var router = express.Router();

//Adding product
exports.product = (req, res, next) => {
  const {
    name,
    price,
    mrp,
    discription,
    brand,
    quantity,
    stockAlart,
    catagory,
    isfeatured,
  } = req.body;
  let image = [];
  if (req.files.length > 0) {
    image = req.files.map((file) => {//file means map function take two argument 1st data 2nd index //
      return { img: file.filename };
    });
  }
  const product = new Product({
    name,
    price,
    mrp,
    discription,
    brand,
    quantity,
    stockAlart,
    catagory,
    isfeatured,
    image
  });
  product.save().then((product)=>{
    console.log(product);
  }).catch((err)=>{
    console.log(err+"Product database Insertion Error")
  })


  console.log(req.body);
  console.log(req.files);
  res.render("admin/add-product", { admin: true });
};
