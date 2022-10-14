var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin',{admin:true})
});

router.get('/product-management', function(req, res, next) {
  res.render('admin/product-management',{admin:true})
});

module.exports = router;
