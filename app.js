if(process.env.NODE_ENV != "production"){
require("dotenv").config({ quiet: true });
};







const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routers
const ListingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB connection
// const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
}
main();

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
 
  crypto:{secret:process.env.SECRET}, 
  touchAfter: 24 * 60 * 60,
});
store.on("error",() => {
  console.log("error in session store" ,err);
});

// Session & Flash
const sessionOptions = {
  store,
  secret:process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages & current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// // Root Route
// app.get("/", (req, res) => {
//   res.render("home.ejs"); // Optional: create a home.ejs template
// });

// Routes
app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start Server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
