// var User = require("../models/user");

var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
var Order=require("../../models/order")

exports.userManagement = async (req, res) => {
  console.log("user management...");
  const user = await User.find({});
  if (!user) {
    console.log("No user");
    res.render("admin/user-management", { admin: true, user });
  } else {
    console.log("finded user for admin..", user);
    res.render("admin/user-management", { admin: true, user });
  }
};

exports.unblock = async (req, res) => {
  console.log("user id..", req.body);

  let userid = req.params.id;
  console.log("userdidd", userid);

  return new Promise(async (resolve, reject) => {
    const updateUser = await User.updateOne(
      { _id: userid },
      { $set: { blocked: false } }
    );
    resolve({ status: true });
    console.log("updated user status to true..", updateUser);
  }).then((response) => {
    res.json(response);//this go to the ajax success
  });
};

exports.blockUser = async (req, res) => {
  console.log("user id..", req.body);
  let userid = req.params.id;

  return new Promise(async (resolve, reject) => {
    var updateUser = await User.updateOne(
      { _id: userid },
      { $set: { blocked: true } }
    );
    resolve({ status: true });
    console.log("updated user status to true..", updateUser);
  }).then((response) => {
    res.json(response);
  });
};
