const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingcontroller =require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

//  Validation Middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(
  
  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingcontroller.createlisting)
);





// New Listing Form
router.get("/new", isLoggedIn,listingcontroller.rendernewform );

// Show Listing Details
router.get(
  "/:id",
  wrapAsync(listingcontroller.showlisting)
);



// Edit Listing Form
router.get(
  "/:id/edit",
  isLoggedIn, // ✅ only logged in users should access edit
  wrapAsync(listingcontroller.editlisting)
);

// Update Listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
   upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingcontroller.updatelisting)
);

// Delete Listing
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(listingcontroller.deletelisting)
);

module.exports = router;
