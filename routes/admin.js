var express = require("express");
var router = express.Router();
const multer = require("multer");
const Catagory = require("../models/catagory");
const shortid = require("shortid");
const path = require("path");

const {
  catagory,
  getcatagory,
  deletecatagory,
  editcatagory,
  updatetcatagory,
} = require("../controller/admin/catagory");
const {
  catagorylist,
  product,
  getproduct,
  deleteproduct,
  updateproduct,
  editproduct,
} = require("../controller/admin/product");
const {
  userManagement,
  unblock,
  blockUser,
} = require("../controller/admin/userManagement");

const { adminLogin ,adminLoginPost} = require("../controller/admin/adminLogin");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "public/upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ADMIN LOGIN
// router.get("/admin-login", adminLogin);


// router.post("/admin-login", adminLoginPost);

let userName = "ananthu";
let Pin = "12345";


const Verifyadmin = (req, res, next) => {
  if (req.session.users) {
    next();
  } else {
    res.redirect("/");
  }
};


router.get("/", async function (req, res, next) {
  if (req.session.users) {
    console.log("Hellooo");
    res.redirect("/admin/dashboard");
  } else {
  
    let err=req.session.err

    res.render("admin/admin-login", { title: "Admin", login: true,err });

    req.session.err=null

  }
});

router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (userName === email && Pin === password) {
    // req.session.check = true;
    req.session.users = true;
    res.redirect("/admin/dashboard");
  } else {
    req.session.err = "incorrect username or password";
     res.redirect('/admin')
  }
});



// ---------------------------------------------------------------------------//
router.get("/dashboard",Verifyadmin, function (req, res, next) {
  res.render("admin/admin", { admin: true });
});

//CATAGORY//
router.get("/product-management",Verifyadmin, getproduct); //viewing product page

router.post("/add-catagory",Verifyadmin, upload.none(), catagory); //adding catagory

router.get("/view-category-management",Verifyadmin, upload.none(), getcatagory); //getting added catagories

router.get("/delete-catagory/:id",Verifyadmin, upload.none(), deletecatagory); //deleting selected catagory

router.get("/edit-catagory/:id",Verifyadmin, upload.none(), editcatagory); //edit catagory

router.post("/edit-catagory/:id",Verifyadmin, upload.none(), updatetcatagory); //edit catagory

//PRODUCT//
router.get("/add-product",Verifyadmin, catagorylist); //passing catagory to add product//IMPORTANT catagory need change

router.post("/add-product",Verifyadmin, upload.array("image"), product); //adding product

router.get("/delete-product/:id",Verifyadmin, upload.none(), deleteproduct); //deleting product

router.get("/edit-product/:id",Verifyadmin, upload.none(), editproduct); //deleting product

router.post("/edit-product/:id",Verifyadmin, upload.array("image"), updateproduct); //Updating product

// USER MANAGEMENT

router.get("/user-management",Verifyadmin, userManagement);

router.put("/unblock/:id",Verifyadmin, unblock);

router.put("/blockUser/:id",Verifyadmin, blockUser);

module.exports = router;
