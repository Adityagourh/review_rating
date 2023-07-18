require("dotenv").config();
require("./config/modelConfig");
let commonRouter = require("./routes/mainRouter");
let express = require("express");
const { transporter, mailOption } = require("./services/emailService");
const cron =require('node-cron')

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
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
