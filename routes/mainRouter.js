let express = require("express");
const userRoutes = require("./userRoutes");
const companyRouter = require("../routes/companyRoute");
const reviewRouter = require("./reviewRoutes");

let commonRouter = express.Router();

commonRouter.use("/user", userRoutes);
commonRouter.use("/company", companyRouter);
commonRouter.use("/comment", reviewRouter);

module.exports = commonRouter;
