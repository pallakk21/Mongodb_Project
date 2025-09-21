const User = require("../models/user"); // Adjust the path if needed


module.exports.rendersignupform = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);

      // Auto-login after signup
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings"); // redirect after signup
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

  module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo; // remove after using
    res.redirect(redirectUrl);
  };
  module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};