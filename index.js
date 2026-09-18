require("dotenv").config();
require("./config/modelConfig");
const commonRouter = require("./routes/mainRouter");
const express = require("express");
const cors = require("cors");
const cron =require('node-cron')
const { transporter, mailOption } = require("./services/emailService");
const logger = require("./utils/userLoger")

let app = express();
app.use(cors()); // allow the frontend (different origin/port) to call this API
app.use(express.json()); // install json formate from express
app.use("/uploads", express.static(__dirname + "/uploads")); // serve uploaded profile/company images
app.use("/", commonRouter); // use common router

// Email send by nodemailer
// SMTP email sending disabled locally — hardcoded OTP used instead.
app.get("/send", async (req, res) => {
  // transporter.sendMail(mailOption, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email send Succesfully  " + info.response);
  //   }
  // });
  const otp = "435568"; // hardcoded local OTP
  console.log("OTP (email sending disabled locally): " + otp);
  res.status(200).json({ success: true, otp: otp });
});

//email send by cron job
// SMTP email sending disabled locally — hardcoded OTP used instead.
`cron.schedule("*/10 * * * * *" ,function(){
  console.log("hey")
  const otp = "435568"; // hardcoded local OTP
  console.log("OTP (email sending disabled locally): " + otp);
  // app.get("/send", async (req, res) => {
  //   transporter.sendMail(mailOption, (error, info) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Email send Succesfully  " + info.response);
  //     }
  //   });
  // });

});`
 
 
//listener for server
const HOST = 'localhost';
const PORT = process.env.PORT ||9000;
const server  = app.listen(process.env.PORT, (req, res) => {
  //console.log(`Server is running on PORT : ${process.env.PORT}`);
  logger.info(`server started and runnig on http://${HOST}:${PORT}`);
});

module.exports = server; 
