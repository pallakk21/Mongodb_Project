// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//     email:{
//         type:String,
//         required:true,
//     },
// });
// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User",userSchema);



const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,   // ✅ prevent duplicate emails
    lowercase: true, // ✅ normalize emails
    trim: true,
  },
});

// ✅ this will automatically add username, hash & salt fields
// ✅ also gives you helper methods like .register(), .authenticate()
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
