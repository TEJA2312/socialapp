var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({

   author: {
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
       firstname: String,
       lastname:String
    },


authorof_book:{
	type:String,

},

  title:{
	type:String,

   },
 
   your_summary:{
	type:String,

   },


   what_like:{
	type:String,

   },

  what_dislike:{
	type:String,

   },

  
 rating:{
	type:String,
	
   },

 image:{
  type:String,

 },

 Blog_type:{
  type:String,
 },

time : { 
  type : Date, 
  default: Date.now 
},

//array to be added with push
 comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
     }],
     



});


module.exports = mongoose.model("Blog", UserSchema);


