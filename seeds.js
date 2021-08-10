var mongoose = require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
    {
         name:"Leh D",
       image: "https://image.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-260nw-407021107.jpg",
       description:"Good place" 
    },
    {
        name:"Green park",
        image: "https://image.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-260nw-407021107.jpg",
        description:"Good place" 
      },
    {
        name:"Blue Skyes",
        image: "https://image.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-260nw-407021107.jpg",
        description:"Good place" 
     }
]


function seedDB()
{
    Campground.remove({},function(err){
        // if(err)
        //     console.log(err);
            
        //     console.log("Deleted.....");
        
        //     data.forEach(function(seed)
        //     { 
        //         Campground.create(seed,function(err,campground){
        //             if(err)
        //                 console.log(err);
        //             else {
        //                 console.log("data added!");
        //                 Comment.create({
        //                     text :"Place was good",
        //                     author :" Aaayush"
        //                 },function(err,comment){
        //                     if(err)
        //                         console.log(err);
        //                     else
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("new comment");
        //                 });
        //             } 
                        
        //         });
        //     });

        });    
}


module.exports=seedDB;