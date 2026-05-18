const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/user.js");

const saveRedirectUrl = (req, res, next) => {
  if (req.query.redirect) {
    req.session.returnTo = req.query.redirect;
  }
  next();
};

router.get("/signup", userController.rendersignupform);

router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.renderloginform);

router.post(
  "/login",
  saveRedirectUrl,
  (req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  },
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
