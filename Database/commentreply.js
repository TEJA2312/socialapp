
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

   author: {
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        comment_id: {
        	type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },

            blog_id: {
        	type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        },

        firstname: String,
        lastname: String
    },
 
 reply:{
 	type:String,
}



});

module.exports = mongoose.model("Commentreply", UserSchema);