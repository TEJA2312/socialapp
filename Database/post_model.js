var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var UserSchema = new mongoose.Schema({

   author: {
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
       firstname: String,
       lastname:String
    },


  destination:{
	type:String,
	required: true
   },
 
   title:{
	type:String,
	required: true
   },


   about_trip:{
	type:String,
	required: true
   },

  food_section:{
	type:String,
	required: true
   },

  
 best_spot:{
	type:String,
	required: true
   },
//array to be added with push
 comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"

    }],

 // likes: [{
 //        type: mongoose.Schema.Types.ObjectId,
 //        ref: "Like"

 //    }]


});
UserSchema.plugin(timestamps);

module.exports = mongoose.model("Blog", UserSchema);

