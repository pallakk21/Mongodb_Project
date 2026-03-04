const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// 1. Validation Middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

// 2. Index & Create Route
// Index route (GET "/") ab controller ke through category filtering handle karega
router
    .route("/")
    .get(wrapAsync(listingcontroller.index)) 
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingcontroller.createlisting)
    );

// 3. New Listing Form
router.get("/new", isLoggedIn, listingcontroller.rendernewform);

// 4. Show, Update & Delete Routes
router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showlisting))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingcontroller.updatelisting)
    )
    .delete(
        isLoggedIn,
        isOwner, 
        wrapAsync(listingcontroller.deletelisting)
    );

// 5. Edit Listing Form
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.editlisting)
);

module.exports = router;