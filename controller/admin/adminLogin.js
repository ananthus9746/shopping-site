let Admin =require('../../models/adminLogin')

exports.adminLogin=(req,res)=>{

    console.log("admin login credentials..",req.body)

    let login=true;
    
    res.render('admin/admin-login',{ login })
}