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

// Register : GET Method
const loadRegister = async(req,res) =>{
    try{

        res.render('registration');

    }catch(error){
        console.log(error.message);
    }
}

// Register : Post Method
const insertUser = async(req,res)=>{

    try{
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.first_name,
            lname: req.body.last_name,
            email: req.body.email,
            mobile: req.body.phone_number,
            image: req.file.filename,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if(userData){
            res.render('registration', {message:"Your registration has been Successfull. please Verify Your mail"});
        }
        else{
            res.render('registration',{message:"Your registration has been failed"});
        }
    }
    catch(error){

        console.log(error.message);
    
    }

}

// Login : GET Method
const loginLoad = async(req,res) =>{

    try{

        res.render('login');

    }catch(error){
        console.log(error.message)
    }

}

// Login : Post Method
const verifyLogin = async(req,res) =>{

    try{

        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});

        if(userData){

            const passwordMatch = await bcrypt.compare(password,userData.password);
            
            if(passwordMatch){
                if(userData.is_varified === 0){
                    res.render('login', {message:"Please verify mail"})
                }
                else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }

            }
            else{
                res.render('login', {message:"Email & password is incorrect"});

            }

        }
        else{
            res.render('login', {message:"Email & password is incorrect"});
        }

    }
    catch(error){
        console.log(error.message);
    }
}

// User Home Page : GET Method
const loadHome = async(req,res) =>{

    try{
        const userData = await User.findById({_id:req.session.user_id});
        res.render('userHome' , {user:userData});

    }catch(error){
        console.log(error.message);
    }

}

// User Logout : GET Method
const userLogout = async(req,res) => {

    try{

        req.session.destroy();
        res.redirect('/');


    }catch(error){
    console.log(error.message);
    }
}

// User Data Update(edit) : GET Method
const editLoad = async(req,res) => {

    try{
        const id = req.query.id;

        const userData= await User.findById({_id:id});
        if(userData){
            
                res.render('adminEdit',{user:userData});

        }else{
            res.redirect('/home');

        }
        
    }
    catch(error){
        console.log(error.message);
    }
}

// User Data Update(edit) : POST Method
const updateProfile = async(req,res) => {

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
                var userDtfl = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{password:passw,image:req.file.filename}});
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
        res.redirect('/home');

     
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,

    loginLoad,
    verifyLogin,

    loadHome,
    userLogout,

    editLoad,
    updateProfile
}

