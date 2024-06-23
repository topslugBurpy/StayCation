const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      //automatically login the user after signing up
      req.login(registeredUser, (err)=>{
        if(err){
          next(err);
        }
        else{
          req.flash("success", "Signed Up successfully!");
          res.redirect("/listings");
        }
      })
    } catch (e) {
      req.flash("failure", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Continue planning your StayCation!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    // res.redirect("/listings");
}

module.exports.logout = (req, res, next)=>{
    req.logout((e)=>{
        if(e){
        next(e);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    })
}