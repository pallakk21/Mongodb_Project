const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// Middleware to save redirect URL
const saveRedirectUrl = (req, res, next) => {
  if (req.query.redirect) {
    req.session.returnTo = req.query.redirect;
  }
  next();
};
const userController = require("../controllers/user.js");

// 🟢 Signup Form
router.get("/signup",userController.rendersignupform );

// 🟢 Signup Logic
router.post(
  "/signup",
  wrapAsync(userController.signup)
);

//  Login Form
router.get("/login", userController.renderloginform);

// Login Logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;
