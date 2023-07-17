let reviewVal= require('./reviewValSchema');

module.exports = {
  reviewValidation: async (req, res, next) => {
    const value = await reviewVal.createReview.validate(req.body, {
      abortEarly: false,
    });
    if (value.error) {
      res.status(403).json({
        success: false,
        message: value.error.details[0].message,
      });
    } else {
      next();
    }
  },
}