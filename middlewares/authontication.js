module.exports = {
  //Athentication middleware
  authorizeAdmin: async (req, res, next) => {
    if (req.user.role === "users") {
      next();
    } else {
      res.sendStatus(403);
    }
  },
};
