module.exports = {
  authorizeAdmin: async (req, res, next) => {
    if (req.user.userRole === "admin") {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }
  },
};
