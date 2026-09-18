const mongoose = require("mongoose");

const companyReviewSchema = new mongoose.Schema({
  subject: {
    type: String,
    require: true,
  },
  review: {
    type: String,
    require: true,
  },
  rating: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    require: true,
  },
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: "company",
    require: true,
  },
  isActive: {
    type: String,
    default: true,
  },
});
companyReviewSchema.set("timestamps", true);

module.exports = mongoose.model("companyReview", companyReviewSchema);
