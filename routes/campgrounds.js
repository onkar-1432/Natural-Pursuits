var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
//mongoose.set('useFindAndModify', false);


//INDEX- show all campgrounds
router.get("/campgrounds", function (req, res) {
    //res.render("campgrounds",{campgrounds:campgrounds});

    Campground.find({}, function (err, allCampgrounds) {
        res.render("campgrounds/index", { campgrounds: allCampgrounds , currentUser : req.user});
    });
});


//CREATE add new campground to database
router.post("/campgrounds",middleware.isLoggedIn,function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price=req.body.price;
    var author={
        id: req.user.id,
        username:req.user.username
    }
    var newCamp = { name: name, image: image, description: description,author:author,price:price };
   // console.log(req.user);
    //Adding new campground in db
    Campground.create(newCamp, function (err,newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //Redirecting to campgrounds
            //console.log(newlyCreated)
            req.flash("success","Successfully new campground created");
            res.redirect("/campgrounds");
        }
    });

});

//NEW - show form to create campground
router.get("/campgrounds/new",middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new",{currentUser : req.user});
});

//SHOW more info about campgrounds
router.get("/campgrounds/:id", function (req, res) {

    //find id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err)
            console.log(err);
        else {
            //console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground,currentUser : req.user });
        }
    });


});

//EDIT  CAMPGROUNDS
router.get("/campgrounds/:id/edit",middleware.checkOwnership,function(req,res)   {
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err)
                req.flash("error",error.message);
                
            else
            {
                if(foundCampground.author.id.equals(req.user._id))
                {
                    res.render("campgrounds/edit",{campground : foundCampground,currentUser : req.user});
                }
                else
                {
                    req.flash("error","You need to be logged in");
                }
            }
                
        });
    
    }
    else
    {
        console.log("You need to be logged in");
        res.send("You need to logged in!!!");
    }
});

//UPDATE CAMPGROUNDS
router.put("/campgrounds/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err)
            res.redirect("/campgrounds");
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DELETE CAMPGROUND
router.delete("/campgrounds/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if(err)
            console.log(err);
        else
        {
            req.flash("success","Deleted Campground");
            res.redirect("/campgrounds");
        }
    });
});



module.exports=router;