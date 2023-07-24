let express = require("express");
let review = require("../controller/companyReviewController");
let {reviewValidation}= require('../validation/reviewValidation/reviewDataVal')

let reviewRouter = express.Router();

reviewRouter.post("/create", review.createReview);
reviewRouter.get("/list", review.listReview);
reviewRouter.patch("/update/:id", review.updateReview);
reviewRouter.delete("/delete/:id", review.deleteReview);

module.exports = reviewRouter;
