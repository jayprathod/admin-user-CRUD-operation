const mongoose = require('mongoose');
mongoose.connect("mongodb://0.0.0.0:27017/Vlogs");

const express = require('express');
const app = express();


const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

const adminRoute = require('./routes/adminroute');
app.use('/admin', adminRoute);

app.listen(5000,function(){
    console.log('PORT 5000 : server is running..');
});

