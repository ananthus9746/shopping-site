// const Product = require("../models/product");
// var express = require("express");
// var fs = require("fs");
// const { route } = require("../routes/admin");
// const Catagory = require("../models/catagory");

var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user")

// fs.unlink('sample.txt', function (err) {
//   if (err) throw err;
//   // if no error, file has been deleted successfully
//   console.log('File deleted!');
// });




//GETTING PRODUCT ADDING PAGE catagorylist for Add product
exports.catagorylist = async (req, res) => {
  const catagoryList = await Catagory.find();
  if (!catagoryList) {
    console.log("No catagory list found");
  } else {
    var catagory = catagoryList;
    res.render("admin/add-product", { admin: true, catagory });
    console.log(catagoryList);
  }
};

//Adding product
exports.product = (req, res, next) => {
  console.log("heroollloo", req.body);
  console.log("for-main image..", req.files);
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
      //file means map function take two argument 1st data 2nd index here used 1st //
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

      console. if (req.files.length > 0) 


     image = req.files.map((file) => {
      //file means map function take two argument 1st data 2nd index here used 1st //
      return { img: file.filename };
    });console.log(product);
    
    })

    



    .catch((err) => {
      console.log(err + "Product database Insertion Error");
    });
  console.log("Inserted photo with data ", req.body);
  console.log(req.files);
  
  res.redirect("/admin/add-product",);
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
  let productid = req.params.id;
  console.log("iddd", productid);

  console.log("proid...", productid);
  const productd = await Product.findById(productid);

  console.log("catagory id 11...", productd.catagory.toString());
  let catid = productd.catagory.toString();
  console.log("catagory id converted to string..", catid);

  //single catagory
  const onecatagory = await Catagory.findById(catid);
  if (!onecatagory) {
    console.log("No catagory list found");
  } else {
    var catagory = onecatagory;
    console.log("finded catagory..", catagory);
  }

  //all catagory
  const catagoryList = await Catagory.find();
  if (!catagoryList) {
    console.log("No catagory list found");
  } else {
    // var catagory = catagoryList;
    console.log("finded catagory..", catagoryList);
  }

  if (!productd) {
    console.log("No product found");
  } else {
    res.render("admin/edit-product", {
      admin: true,
      catagory,
      catagoryList,
      productd,
    });
    console.log("product from productd edit product..", productd);
  }
};

exports.updateproduct = async (req, res) => {
  let protid = req.params.id;
  console.log("proid from update..", protid);
  console.log("update...", req.body);
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

  let product = await Product.findByIdAndUpdate(protid, {
    name,
    price,
    mrp,
    discription,
    brand,
    quantity,
    stockAlart,
    catagory,
    isfeatured,
  });
  if (!product) {
    console.log("No product found");
  } else {
    // res.render("admin/edit-product", { admin: true, catagory, product });
    res.redirect("/admin/product-management");
  }
};
