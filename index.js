require("dotenv").config();
require("./config/modelConfig");
const commonRouter = require("./routes/mainRouter");
const express = require("express");
const cron =require('node-cron')
const { transporter, mailOption } = require("./services/emailService");
const logger = require("./utils/userLoger")

let app = express();
app.use(express.json()); // install json formate from express
app.use("/", commonRouter); // use common router

// Email send by nodemailer
app.get("/send", async (req, res) => {
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email send Succesfully  " + info.response);
    }
  });
});

//email send by cron job 
`cron.schedule("*/10 * * * * *" ,function(){
  console.log("hey")
  app.get("/send", async (req, res) => {
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email send Succesfully  " + info.response);
      }
    });
  });
    
});`
 
 
//listener for server
const HOST = 'localhost';
const PORT = process.env.PORT ||9000;
const server  = app.listen(process.env.PORT, (req, res) => {
  //console.log(`Server is running on PORT : ${process.env.PORT}`);
  logger.info(`server started and runnig on http://${HOST}:${PORT}`);
});

module.exports = server; 
