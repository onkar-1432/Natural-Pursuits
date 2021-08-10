var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware=require("../middleware");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function (req, res) {

    Campground.findById(req.params.id, function (err, campground) {
        if (err)
            req.flash("error","Something went wrong");
        else
            res.render("comments/new", { campground: campground, currentUser: req.user });
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err)
             req.flash("error","Something went wrong");
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err)
                    req.flash("error","Something went wrong");
                else {

                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    // console.log("comment pushed...");
                    campground.save();
                    req.flash("success","Successfully added new comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function (req, res) {

    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }

    });

});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
        if(err)
            res.redirect("back");
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
  //res.send("Hit UPDATE");

});

//DELETE comment

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function( req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err) 
            console.log(err);
        else
        {
            req.flash("success","Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
            
    });
});





module.exports = router;