
var express = require("express");
var fs = require("fs");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product"); 







//Getting product
exports.homePage = async (req, res) => {
    const product = await Product.find().populate("catagory");
    if (!product) {
      console.log("No product found");
    } else {
      let products = product;
      res.render("user/index", {products});
      console.log("product list for home page...", products);
    }
  };
  
  //VIEW SINGLE PRODUCT

  exports.viewSingleProduct = async (req, res) => {
    let proid=req.params.id;
    console.log("Product id view single prodcut...",proid);

    const singleProduct= await Product.findById(proid)
    if(!singleProduct){
      console.log("No product find on this id")
    }
    else{
      console.log("FINDED PRODUCT...",singleProduct)

      res.render("user/singleProduct",{singleProduct})
    }


  };