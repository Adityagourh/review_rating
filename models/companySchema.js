const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    require: true,
  },
  companyCity: {
    type: String,
    require: true,
  },
  companyLocation: {
    type: String,
    require: true,  
  },
  profilePic: {
    type:String,
  },
  isActive: {
    type: String,
    default: true,
  },
});
companySchema.set("timestamps", true);

module.exports = mongoose.model("company", companySchema);
