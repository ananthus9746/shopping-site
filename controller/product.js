const Product = require("../models/product");
var express = require("express");
var fs = require("fs");
const Catagory = require("../models/catagory");
const { route } = require("../routes/admin");

// fs.unlink('sample.txt', function (err) {
//   if (err) throw err;
//   // if no error, file has been deleted successfully
//   console.log('File deleted!');
// });

//Adding product
exports.product = (req, res, next) => {
  console.log("heroollloo", req.body);

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
    image = req.files.map((file) => {
      //file means map function take two argument 1st data 2nd index //
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
    image,
  });
  product
    .save()
    .then((product) => {
      console.log(product);
    })
    .catch((err) => {
      console.log(err + "Product database Insertion Error");
    });
  console.log("Inserted photo with data ", req.body);
  console.log(req.files);
  res.render("/admin/add-product");
};

//Getting product
exports.getproduct = async (req, res) => {
  const product = await Product.find().populate("catagory");
  if (!product) {
    console.log("No product found");
  } else {
    let getproduct = product;
    res.render("admin/product-management", { admin: true, getproduct });
    console.log("product list...", getproduct);
  }
};
//Deleting product
exports.deleteproduct = async (req, res) => {
  console.log(req.body);
  let productid = req.params.id;
  Product.findByIdAndRemove(productid)
    .then((product) => {
      if (product) {
        console.log("Product removed", product);
      } else {
        console.log("some errorin deleting product");
      }
    })
    .catch((err) => {
      console.log("Error in deleting product", err);
    });
  res.redirect("/admin/product-management");
};

//edit product
exports.editproduct = async (req, res) => {
  console.log("from edit product..", req.body);
  console.log("from edit product pro id..", req.body.params);

  const catagoryList = await Catagory.find();
  if (!catagoryList) {
    console.log("No catagory list found");
  } else {
    var catagory = catagoryList;
    console.log(catagoryList);
  }
  var catagory = catagoryList;


  res.render("admin/edit-product", { admin: true, catagory, });

  console.log("from edit product..22", req.body);
  console.log("from edit product pro id..222", req.body.params);
};

exports.updateproduct = async (req, res) => {
  let protid = req.params.id;
  let product = await Product.findByIdAndUpdate(protid, {
    name: req.body.name,
    price: req.body.price,
    mrp: req.body.mrp,
    discription: req.body.discription,
    brand: req.body.brand,
    quantity: req.body.quantity,
    stockAlart: req.body.stockAlart,
    catagory: req.body.catagory,
    isfeatured: req.body.isfeatured,
    upsert: true,
  });

  console.log("from update product...", req.body);
  console.log("images...", req.files);
};
