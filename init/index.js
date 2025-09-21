// const mongoose = require("mongoose");
// const initdata = require("./data.js");
// const listing = require("../models/listing.js");  
// const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
// main()
// .then(() => {console.log ("connected to db");})

// .catch((err ) =>{ console.log(err)});

// async function main() {
//   await mongoose.connect(mongourl);}  
//   const initDB = async () => {
//     await listing.deleteMany({});
//     await listing.insertMany(initdata.data);
//     console.log("data initialized");
//   }
//   initDB();

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");  
const mongourl = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(mongourl);
    console.log("Connected to db");
    
    await Listing.deleteMany({});
     initdata.data = initdata.data.map((obj) => ({
      ...obj,owner:"68bc08163470d7e93f0d2515",
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data initialized");
    
    mongoose.connection.close();  // Close connection after done
  } catch (err) {
    console.log("Error connecting to db or initializing data:", err);
  }
}

main();
