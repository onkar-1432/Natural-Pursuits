var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var UserScehma=new mongoose.Schema({
    username:String,
    password: String
});

UserScehma.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserScehma);