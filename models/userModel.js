const mongoose = require('mongoose');

const userShema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    lname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    is_admin:{
        type:Number,
        require:true
    }

});

module.exports = mongoose.model('Users',userShema);
