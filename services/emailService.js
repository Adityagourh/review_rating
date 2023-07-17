const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail" , 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD ,
    },
})
const mailOption ={
    from :"aditya.ca777@gmail.com" , 
    to   :"gautampiplotiya@gmail.com" , 
    subject : "Hey mail section" ,
    text: `this is nodemail send 😊` ,    
}

module.exports ={
    transporter,
    mailOption,
}