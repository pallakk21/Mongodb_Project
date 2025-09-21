const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (e) {
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
    console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

module.exports.editlisting = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  } catch (e) {
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.updatelisting = async (req, res) => {
  
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if( typeof req.file !== undefined){
    let url = req.file.path;
    let  filename = req.file.filename;
    listing.image ={ url , filename};
    await listing.save();}

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } 

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
