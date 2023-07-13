const express = require('express');
const admin_route = express();
admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:false}));

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({secret:config.sessionSecret,
                        resave: true,
                        saveUninitialized: true}));


const path = require('path');
const multer = require('multer'); //multer store the image file
const userprofilepath = path.join(__dirname,'../public/userImages');
admin_route.use(express.static(userprofilepath));
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
admin_route.use(express.static(userpath));
console.log(userpath);
admin_route.set('view engine','ejs');
admin_route.set('views',userpath);


const auth = require('../middleware/adminauth');
const adminController = require('../controllers/adminController');


admin_route.get('/', auth.isLogout , adminController.loadLogin);
admin_route.post('/login', adminController.verifylogin);

admin_route.get('/home', auth.isLogin , adminController.loadDashbord);

admin_route.get('/logout', auth.isLogin ,adminController.logout);

admin_route.get('/dashbord', auth.isLogin , adminController.adminDeshbord);
// admin_route.post('/dashbord', auth.isLogin , adminController.adminDeshbord);

admin_route.get('/delet-user', auth.isLogin,adminController.deleteUser);

admin_route.get('/edit-User', auth.isLogin,adminController.editLoad);
admin_route.post('/edit-User', upload.single('image') ,adminController.addUser);

admin_route.get('/*',function(req,res){
    res.redirect('/admin');
});

module.exports = admin_route;