let Admin = require("../../models/adminLogin");
const user = require("../../models/user");

var myusername = "ananthus.ann@gmail.com";
var mypassword = "sandeep123";

exports.adminLogin = (req, res) => {
  console.log("entered get login");

  // let login = true;

  res.render("admin/admin-login", { admin: true });
};

exports.adminLoginPost = (req, res) => {
  console.log("admin login credentials..", req.body);

    if (req.body.username == myusername && req.body.password == mypassword) {
      session = req.session;
      session.userid = req.body.username;
      console.log(req.session);

      res.render('/')

    } else {
      
  res.render("admin/admin-login", { login });
}

};













  // let adminlogin = false;
  // let response = {};

  // if (req.body.username === username && req.body.password === password) {
  //   let adminlogin = true;

  //   res.redirect("/");

  //   // response.admin = admin;
  //   // response.status = true;

  //   req.session.adminLogin = true;

  //   // req.session.admin = response.admin;
  // } else {
  //   res.render("admin/admin-login", { login });
  // }

