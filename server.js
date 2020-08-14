
// ----require all models and packages from express----
var mongoose = require('./database/mongoose');
var Blog = require('./database/Book_model');
var Comment = require('./database/comment');
var Commentreply = require('./database/commentreply');

var express = require('express');
var bodyParser = require('body-parser');
var User = require('./database/User_model');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var app = express();





// ---bodyparser and methode-override config--
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret:"Tripology",
	resave: false,
	saveUninitialized: false
}));


// ----passport.js config------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/',(req,res)=>{

res.redirect('/home');

});

//-------------HOME PAGE-------------

app.get('/home',(req,res)=>{

console.log(req.user);

Blog.find().then((docs)=>{

res.render('Home',{docs:docs,currentUser:req.user});

},(err)=>{
	console.log(err);
})

});

//-----------------------------------


//_______________REGISTER AUTH ROUTE_________________

//get register form 
app.get('/register',(req,res)=>{

res.render('register');

});


app.post("/register",(req, res)=>{
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dateof_birth: req.body.dateof_birth,
    
    });
    User.register(newUser, req.body.password, (err, user)=> {
        if (err) {
            console.log(err);

            return res.render("register")
        }
        passport.authenticate("local")(req, res, function () {//build in methode to register provided by passport.js package
            res.redirect('/home');
        });
    });


 });

//________________________________________________________________




//_______________BLOG ROUTE(POST)____________________________

//get post form
app.get('/blog',isLoggedIn,(req,res)=>{

res.render('postform');

});

app.post("/blog",isLoggedIn,(req, res)=> {
   
    var authorof_book = req.body.authorof_book;
    var title = req.body.title;
    var your_summary = req.body.your_summary;
    var what_like = req.body.what_like;
    var what_dislike = req.body.what_dislike;
    var rating = req.body.rating;
    var image = req.body.image;
    var type = req.body.type;


     var author ={
    	
    	 ID: req.user._id,
    	 firstname: req.user.firstname,
         lastname:req.user.lastname

       }; 
    
    
    var newBlog = {
        
        authorof_book:authorof_book,
        title:title,
        your_summary:your_summary,
        what_like:what_like,
        what_dislike:what_dislike,
        rating:rating,
        author: author,
        image:image,
        Blog_type:type,
        
       };
   
    Blog.create(newBlog, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
        
            res.redirect("/home");
        }
    });
});

//___________________________________________________________


//_______________BLOG ROUTE(SHOW)____________________________

//show route with Comment model  populated as array comments[]

app.get('/home/:id',(req,res)=>{

	Blog.findById(req.params.id).populate('comments').then((docs)=>{
		res.render('show1',{docs:docs,currentUser:req.user});
        console.log({docs});
	},(err)=>{
		console.log('error in find:', err);
	})

},(err)=>{
	console.log('error in get:', err);
});

//______________________________________________________________



//_______________COMMENT ROUTE(POST)____________________________



app.post('/home/:id/comment',isLoggedIn,(req,res)=>{

   var author ={
        
         ID: req.user._id,
         firstname: req.user.firstname,
         lastname: req.user.lastname,
         blog_id: req.params.id

       };

   var comment = req.body.comment;

   var newcomment= {
    author:author,
    comment:comment

   }


   Blog.findById(req.params.id, function (err, docs) {
        if (err) {
            console.log(err);
            res.redirect("/home");
        } else {
            //-----------------------------------------------------
            Comment.create(newcomment, function (err, comment) {
                if (err) {
                   
                    console.log(err);
                } else {
        
            //-------------------------------------------------------
             // save comment
                    comment.save();
                    docs.comments.push(comment);
                    docs.save();
               
                    res.redirect("/home/" +docs._id);
                }
            });
        }
    });

},(err)=>{
    console.log('error in get:', err);
});

//___________________________________________________________________________________

//___________________Comment Delete_____________________________________________________

app.delete("/home/:id/:comment_id", function (req, res) {

    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("/home");
        } else {
            
            res.redirect("/home/" + req.params.id);
        }
    });
});

//_________________________________________________________________________________

//___________________REPLY TO COMMENT________________________________________________


app.get('/reply/:comment_id',(req,res)=>{



Comment.findById(req.params.comment_id).populate('commentreplys').then((docs)=>{
    res.render('replyform',{docs:docs,currentUser:req.user });
})

});


app.post('/home/:id/:comment_id/reply',isLoggedIn,(req,res)=>{

   var Replier ={
        
         ID: req.user._id,
         firstname: req.user.firstname,
         lastname: req.user.lastname,
         comment_id: req.params.comment_id,
         blog_id: req.params.id

       };

var reply = req.body.reply;

   var newreply= { author:Replier,
   reply:reply };

Blog.findById(req.params.id, function (err, docs) {
    if(err){
        console.log(err);
    }

   Comment.findById(req.params.comment_id, function (err, comment) {

        if (err) {
            console.log(err);
            res.redirect("/home");
        } else {
            //-----------------------------------------------------
            Commentreply.create(newreply, function (err,reply  ) {
                if (err) {
                   
                    console.log(err);
                } else {
        
            //-------------------------------------------------------
             // save reply
                    reply.save();
                    comment.commentreplys.push(reply);
                    comment.save();
               
                    res.redirect("/reply/"+ req.params.comment_id);
                }
            });
        }
    });
});
});

app.delete('/replydelete/:commentid/:replyid',checkreplyOwnership,(req,res)=>{

Commentreply.findByIdAndRemove(req.params.replyid).then((docs)=>{

 console.log("this data was removed by user", {docs});
 res.redirect('/reply/'+ req.params.commentid);
},(err)=>{
    console.log("error occured in delete:",err);
});
});


//_______________BLOG ROUTE(EDIT)____________________________


app.get('/home/:id/edit',checkBlogOwnership,(req,res)=>{

	Blog.findById(req.params.id).then((docs)=>{
		res.render('blogedit',{docs:docs});
	},(err)=>{
		console.log('error in find:', err);
	})

},(err)=>{
	console.log('error in get:', err);
});


app.put('/home/:id',checkBlogOwnership,(req,res)=>{

Blog.findOneAndUpdate({_id:req.params.id},{

$set:{
	    authorof_book:req.body.authorof_book,
        title:req.body.title,
        your_summary:req.body.your_summary,
        what_like:req.body.what_like,
        what_dislike:req.body.what_dislike,
        rating:req.body.rating,
       
        image:req.body.image,
        Blog_type:req.body.type,
}


}).then((docs)=>{

		res.redirect('/home/'+ req.params.id);
		console.log("this data was edited showing the PAST data:",{docs});

	},(err)=>{
		console.log('error in find:', err);
		res.redirect('/home')

	});
});

//____________________________________________________________________________________

//_______________BLOG ROUTE(DELETE)____________________________


//get delete confirmation

app.get('/home/:id/delete',checkBlogOwnership,(req,res)=>{

Blog.findById(req.params.id).then((docs)=>{
		res.render('deleteconfirmation',{docs:docs});
	},(err)=>{
		console.log('error in find:', err);
	})

});


app.delete('/home/:id',checkBlogOwnership,(req,res)=>{

Blog.findByIdAndRemove(req.params.id).then((docs)=>{

 console.log("this data was removed by user", {docs});
 res.redirect('/home');
},(err)=>{
	console.log("error occured in delete:",err);
});
});

//_________________________________________________________________________


//_________________AUTHENTICATION FUNCTIONALITY_____________________________


//Login
app.get('/login',(req,res)=>{

res.render('login');

});

app.post('/login',passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/login"
})  ,(req,res)=>{

});
//Logout

app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/home');
	console.log("user logged out");
})


//_________________________________________________________________________


//--------------------------MIDDLEWARE SECURITY---------------------------

// to check wether vister is logged in or not
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
//to chech ownership of the blog on server side
 function checkBlogOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function (err, docs) {
            if (err) {
                res.render("Security_alert.ejs");
            } else {
               
                if (docs.author.ID.equals(req.user._id)) {
                    next();
                } else {
                    
                    res.render("Security_alert.ejs");
                }
            }
        });
    } else {
        res.render("Security_alert.ejs");
    }
}
 // to chech ownership of comment the on server side
 function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.id, function (err, docs) {
            if (err) {
                res.render("Security_alert.ejs");
            } else {
                // doues user own the campground?
                if (docs.author.ID.equals(req.user._id)) {
                    next();
                } else {
                    
                    res.render("Security_alert.ejs");
                }
            }
        });
    } else {
        res.render("Security_alert.ejs");
    }
}
 // to chech ownership of reply the on server side
 function checkreplyOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Commentreply.findById(req.params.replyid, function (err, docs) {
            if (err) {
                res.render("Security_alert.ejs");
            } else {
                // doues user own the campground?
                if (docs.author.ID.equals(req.user._id)) {
                    next();
                } else {
                    
                    res.render("Security_alert.ejs");
                }
            }
        });
    } else {
        res.render("Security_alert.ejs");
    }
}


//----------------------------------------------------------------------------------------------

app.get("/users",(req,res)=>{

    User.find().then((docs)=>{
        res.render('users',{docs:docs});
    },(err)=>{s
        console.log(err);
    });
});

//---------------------------------------------------------------------------------------



app.listen(process.env.PORT||3000, process.env.IP, function(){
 console.log("USER SERVER HAS STARTED");
});

