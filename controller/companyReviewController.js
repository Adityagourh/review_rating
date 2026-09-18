let companyReviewSchema = require("../models/companyReviewSchema");

module.exports = {
  createReview: async (req, res) => {
    try {
      const review = new companyReviewSchema(req.body);
      let user = await review.save();
      res.status(201).json({
        success: true,
        message: "Review added successfully",
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error occur ${error.message}`,
      });
    }
  },

  //fetch comment from datase
  listReview: async (req, res) => {
    try {
      let comment = await companyReviewSchema.find();
      res.status(200).send({
        success: true,
        message: "Record's get successfully!",
        comment: comment,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        error: error,
      });
    }
  },

  //Update data
  updateReview: async (req, res) => {
    let reviewId = req.params.id;
    try {
      let updateRev = await companyReviewSchema.findByIdAndUpdate(
        reviewId,
        req.body,
        {
          new: true,
        }
      );
      res.status(201).send({
        success: true,
        message: "Review records update successfully",
        updateReview: updateRev,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error,
      });
    }
  },

  //Delete data from database
  deleteReview: async (req, res) => {
    let reviewId = req.params.id;
    try {
      let deleteRev = await companyReviewSchema.findByIdAndDelete(
        reviewId,
        req.body,
        { new: true }
      );
      res.status(202).send({
        success: true,
        message: "Comment records delete successfully",
        deletedReview: deleteRev,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error,
      });
    }
  },
};
