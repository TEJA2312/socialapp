
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({

  username:{
 	type: String,
 	required: true
    },


   password:{
	type:String,
	trim :true
   },
   
   firstname:{
   	type:String,
   	default:'Profile Incomplete'
   },

   lastname:{
   	type:String,
   	default:'Profile Incomplete'
   },

   dateof_birth:{
   	type: Number,
   	default: null
   }




});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);
