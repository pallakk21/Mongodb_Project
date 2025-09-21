const express = require("express");
const router  = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const{ reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewcontroller = "../controllers/review.js";

const validateReview = (req,res,next)=>{
     let {error}=  reviewSchema.validate(req.body);

   if(error){
    let errmsg =error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400, errmsg);
   }else{
    next();
   }
};

//reviews//postroute
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewcontroller.createreview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewcontroller.deletereview));

module.exports = router;