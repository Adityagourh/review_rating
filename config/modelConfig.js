const mongoose = require("mongoose");
const logger = require("../utils/userLoger");
// mongoose.connect('mongodb://localhost:27017/basic1');

mongoose.connect(process.env.URL).catch((err) => {
  // Without this catch, a failed initial connection (bad network path,
  // Atlas IP allow-list, etc.) becomes an unhandled rejection that crashes
  // the whole process instead of just logging the error.
  logger.log("error", `Mongoose initial connection failed: ${err.message}`);
});
mongoose.connection.on("error", (err) => {
  // console.log("mongoose Connection Error", err);
  logger.log(`error`, "mongoose Connection Error")
});
mongoose.connection.on("connected", (err, res) => {
  // console.log("mongoose is connected");
  logger.log('info', "Mongoose is connected");
}); 