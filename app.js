const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require('connect-flash');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staycation";
main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());



app.listen(8080, ()=>{
    console.log("listening on port 8080");
})

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions));
app.use(flash());

//use the passport below the session because in a single session we would want to remember the user and its info
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=>{
    res.send("this is ROOT");
})

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.failureMsg = req.flash("failure");
    res.locals.currentUser = req.user;
    
    next();
})

// app.get("/demouser", async(req, res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "goofy"
//     })
//     let registeredUser = await User.register(fakeuser, "heygoofy");
//     res.send(registeredUser);

// })

app.use("/", userRouter);

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);


//Error Handling
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next)=>{
    let{statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", {err});
})