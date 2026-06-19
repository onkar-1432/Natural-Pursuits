var express = require("express");
require('dotenv').config();
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStratagy = require("passport-local");
var User = require("./models/user");
var seedDB = require("./seeds");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// mongosh "mongodb+srv://cluster0.mn71b.mongodb.net/myFirstDatabase" --username admin


const databaseUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/natural_pursuits";
if (!process.env.MONGODB_URI) {
    console.warn("Warning: MONGODB_URI is not defined. Using local MongoDB fallback.");
}
mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to db");
}).catch(err => {
    console.error("DB connection error:", err);
});
//seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//To send currentUser in all routes

//==============================
// PASSPORT CONFIGURATION
//==============================

var port = process.env.PORT || 3000;
app.use(require("express-session")({
    secret: "anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
});


// main routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, function () {
    console.log("Yelp server is listening.....");
});

