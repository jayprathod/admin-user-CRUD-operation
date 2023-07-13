const express = require('express');
const user_route = express();

const session = require('express-session');
const config = require('../config/config');
user_route.use(session({secret:config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));

user_route.use(express.json());
user_route.use(express.urlencoded({extended:false}));

const auth = require('../middleware/auth');


const path = require('path');
const multer = require('multer'); //multer store the image file
const userprofilepath = path.join(__dirname,'../public/userImages');
user_route.use(express.static(userprofilepath));
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    }
});
const upload = multer({storage:storage});


const userpath = path.join(__dirname,'../views');
user_route.use(express.static(userpath));
console.log(userpath);

user_route.set('view engine','ejs');
user_route.set('views',userpath);


const userController = require('../controllers/userController');

user_route.get('/register', auth.isLogout ,userController.loadRegister);
user_route.post('/register', upload.single('image') ,userController.insertUser);

user_route.get('/' , auth.isLogout , userController.loginLoad);
user_route.get('/login', auth.isLogout , userController.loginLoad);
user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin , userController.loadHome);

user_route.get('/logout', auth.isLogin , userController.userLogout);

user_route.get('/edit' , auth.isLogin , userController.editLoad);
user_route.post('/edit' , upload.single('image') , userController.updateProfile);


module.exports = user_route;

 