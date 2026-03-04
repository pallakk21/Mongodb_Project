const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    let { q, category } = req.query; 
    let allListings;

    if (q && q.trim() !== "") {
      // Search Logic
      allListings = await Listing.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } },
          { country: { $regex: q, $options: "i" } },
        ],
      });
    } else if (category) {
      // Category Filter Logic
      allListings = await Listing.find({ category: category });
    } else {
      // Default: All listings
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, q, category });
  } catch (e) {
    console.log("Index Error:", e);
    req.flash("error", "Cannot load listings");
    res.redirect("/");
  }
};

module.exports.rendernewform = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (e) {
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.createlisting = async (req, res) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    console.log("Create Error:", e);
    req.flash("error", "Failed to create listing. Make sure category is selected.");
    res.redirect("/listings/new");
  }
};

module.exports.editlisting = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (e) {
    res.redirect("/listings");
  }
};

module.exports.updatelisting = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (e) {
    console.log("Update Error:", e);
    req.flash("error", "Could not update listing");
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.deletelisting = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
};