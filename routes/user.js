const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/user.js");

const saveRedirectUrl = (req, res, next) => {
  if (req.query.redirect) {
    req.session.returnTo = req.query.redirect;
  }
  next();
};

// Signup
router.get("/signup", userController.rendersignupform);
router.post("/signup", wrapAsync(userController.signup));

// Login
router.get("/login", userController.renderloginform);
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
