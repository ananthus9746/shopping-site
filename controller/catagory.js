const Catagory = require("../models/catagory");

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

    res.redirect('/admin/view-category-management')
    next()
};

exports.getcatagory=async(req,res)=>{
  const catagoryList=await Catagory.find();
  if(!catagoryList)
  {
    console.log("No catagory list found")
  }
  else
  {
    var catagory=catagoryList
    res.render('admin/view-category-management',{admin:true,catagory})
    console.log(catagoryList)
  }
}
