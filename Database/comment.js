var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

   author: {
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        blog_id: {
        	type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        },

        firstname: String,
        lastname: String
    },
 
 comment:{
 	type:String,
},

commentreplys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commentreply"

    }],


});


module.exports = mongoose.model("Comment", UserSchema);


