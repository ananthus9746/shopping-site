const Catagory = require("../models/catagory");
var express = require("express");

//Catagory adding
exports.catagory = (req, res, next) => {
  const catagory = new Catagory({
    name: req.body.name,
  });
  catagory
    .save()
    .then((catagory) => {
      console.log(catagory);
    })
    .catch((err) => {
      console.log("err");
    });
  res.redirect("/admin/view-category-management");
  next()
};

//Getting catagory
exports.getcatagory = async (req, res) => {
  const catagoryList = await Catagory.find();
  if (!catagoryList) {
    console.log("No catagory list found");
  } else {
    var catagory = catagoryList;
    res.render("admin/view-category-management", { admin: true, catagory });
    console.log(catagoryList);
  }
};

//catagorylist for Add product
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

//Deleting catagory
exports.deletecatagory = async (req, res) => {
  let catagoryid = req.params.id;
  console.log(catagoryid);
  Catagory.findByIdAndRemove(catagoryid)
    .then((catagory) => {
      if (catagory) {
        console.log("Catagory deleted");
        res.redirect("/admin/view-category-management");
      } else {
        res.satatus(404);
      }
    })
    .catch((err) => {
      return res.satatus(400).json({ err });
    });
};
