const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Password Hashing
const securePassword = async(password)=>{

    try{

       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;

    }catch(error){
        console.log(error.message);
    }
}

// Login : GET Method
const loadLogin = async(req,res)=>{
    try{
        res.render('adminLogin');
    }
    catch(error){
        console.log(error.message);
    }
}

// Login : Post Method
const verifylogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){

                if(userData.is_admin === 0){
                    res.render('adminLogin', {message:'email & password is incorrect'});
                }
                else{
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");
                }
            }
            else{
                res.render('adminLogin', {message:'email & password is incorrect'});
            }
        }
        else{
            res.render('adminLogin', {message:'email & password is incorrect'});
        }

    }
    catch(error){
        console.log(error.message);
    }
}

// Admin Home Page : GET Method
const loadDashbord = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user_id})
        res.render('adminHome',{user:userData});
    }
    catch(error){
        console.log(error.message);
    }
}

// Admin Logout : GET Method
const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }
    catch(error){
        console.log(error.message);
    }
}


const resetPassword = async(req,res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_Password = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{ password:secure_Password,token:''}});

        res.redirect('/admin');

    }
    catch(error){
        console.log(error.message);
    }

}

// Admin Dashbord : GET Method
const adminDeshbord = async(req,res)=>{
    try{
        const usersData = await User.find({is_admin:0});
        res.render('adminPanel',{users:usersData});
        // res.render('dashbord');

    }
    catch(error){
        console.log(error.message);
    }

}

// Admin Edit User Data(edit-User) : GET Method
const editLoad = async(req,res) => {

    try{
        const id = req.query.id;

        const userData= await User.findById({_id:id});
        if(userData){
            
                res.render('edit',{user:userData});
            

        }else{
            res.redirect('/home');

        }
        
    }
    catch(error){
        console.log(error.message);
    }
}

// Admin Edit User Data(edit-User) : POST Method
const addUser = async(req,res)=>{
    try{
        const id = req.query.id;

        const userData= await User.findById({_id:id});

        if( req.file){
            const fid = await User.findOne({_id : {$eq:id}})
            .select({image:1});
            console.log(fid.image);
            const img_name = fid.image;


            var fs = require('fs');
            var imgpath = './public/userImages/'+img_name;
            console.log(imgpath);

            fs.unlinkSync(imgpath,()=>{
                console.log('File Deleted...');
            });

            const nm = req.body.name ;
            const lnm = req.body.lname ;
            const eml = req.body.email ;
            const mno = req.body.mobile ;
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:nm,lname:lnm,email:eml,mobile:mno,image:req.file.filename}});
            
            if(req.body.password){
                var passw = await securePassword(req.body.password);
                console.log('true..yes');
                console.log(passw);
                var userDtfl = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{password:passw ,image:req.file.filename}});
            }

        }else{

            const nm = req.body.name ;
            const lnm = req.body.lname ;
            const eml = req.body.email ;
            const mno = req.body.mobile ;
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:nm,lname:lnm,email:eml,mobile:mno}});
            if(req.body.password){
                var passw = await securePassword(req.body.password);
                console.log('true.. not');
                console.log(passw);
                var userdatas = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{password:passw}});
            }
        }
        res.redirect('/admin/dashbord');
     
    }
    catch(error){
        console.log(error.message);
    }

}

// Admin Delete User Data(edit-User) : GET Method
const deleteUser = async(req,res)=>{
    try{

        const id = req.query.id;
        const fid = await User.findOne({_id : {$eq:id}})
            .select({image:1});
            console.log(fid.image);
            const img_name = fid.image;

            

            var fs = require('fs');
            var imgpath = './public/userImages/'+img_name;
            console.log(imgpath);

            fs.unlinkSync(imgpath,()=>{
                console.log('File Deleted...');
            });
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashbord');
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = { 
    loadLogin,
    verifylogin,
    loadDashbord,
    logout,
    resetPassword,
    adminDeshbord,
    editLoad,
    addUser,
    deleteUser
};

