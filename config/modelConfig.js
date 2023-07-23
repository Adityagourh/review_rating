const mongoose = require("mongoose");
const logger = require("../utils/userLoger");
// mongoose.connect('mongodb://localhost:27017/basic1');

mongoose.connect(process.env.URL, {
  useNewUrlParser: "true",
});
mongoose.connection.on("error", (err) => {
  // console.log("mongoose Connection Error", err);
  logger.log(`error`, "mongoose Connection Error")
});
mongoose.connection.on("connected", (err, res) => {
  // console.log("mongoose is connected");
  logger.log('info', "Mongoose is connected");
}); 