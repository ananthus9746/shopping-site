const Product = require("../models/product");
var express = require("express");

//Adding product
exports.product = (req, res, next) => {
  console.log("heroollloo",req.body)

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
    console.log(product)
  }).catch((err)=>{
    console.log(err+"Product database Insertion Error")
  })
  console.log(req.body);

  
  console.log(req.files);
  
  res.redirect("/admin/add-product");
};
