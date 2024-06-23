const express = require("express");
const app = express();
const path= require("path");
const users = require("./routes/user");
const posts = require("./routes/post");
const PORT = 6969;
const flash = require("connect-flash");
const session = require('express-session');



const sessionoptions = {
    secret:'secretcode',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionoptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})
//flash messages and getting name thru query
app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }
    else{
        req.flash("success", "user registered successfully");
    }
    
    res.redirect("/hello");
})
//redirected to this page
app.get("/hello", (req, res)=>{
    res.render("page", {name: req.session.name});
})


// app.get("/reqCount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a req ${req.session.count} times`);
// })

// app.get("/test", (req, res)=>{
//     res.send("test successful")
// })



//users
app.use("/users", users);
//Posts
app.use("/posts", posts);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});