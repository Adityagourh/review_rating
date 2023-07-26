const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../services/emailService");
const { unlinkSync } = require("fs");

//Create user api
let createUser = async (req, res) => {
  const userData = new userSchema(req.body);
  const salt = await bcrypt.genSalt(10);
  try {
    userData.userName = req.body.userName
      .trim()
      .split(" ")
      .map((data) => {
        return data.charAt(0).toUpperCase() + data.slice(1);
      })
      .join(" ");
    const isUserExist = await userSchema.findOne({
      userEmail: req.body.userEmail,
    });
    if (isUserExist != null) {
      req.file ? unlinkSync(req.file.path) : null;
      res.status(401).json({
        success: false,
        message: "User is already registered with this email",
      });
    } else {
      userData.userPassword = await bcrypt.hash(req.body.userPassword, salt);
      const filePath = `/uploads/user/${req.file.filename}`;
      userData.profilePic = filePath;

      let user = await userData.save();
      res.status(201).json({
        success: true,
        message: "User added sucessfully",
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error occur ${error.message}`,
    });
  }
};

//User Login api
let userLogin = async (req, res) => {
  try {
    let userData = await userSchema.findOne({
      userEmail: req.body.userEmail,
    });
    if (userData) {
      const hashPassword = await bcrypt.compare(
        req.body.userPassword,
        userData.userPassword
      );
      if (userData && hashPassword) {
        const token = jwt.sign({ userData }, process.env.SECRET_KEY, {
          expiresIn: "2m",
        });
        res.status(200).json({
          success: true,
          message: "Login successfully",
          token: token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid user email or password",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "User is not register with this email",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};

//User  Send Email for reset password API
const sendResetLink = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const userData = await userSchema.findOne({
      userEmail: req.body.userEmail,
    });
    if (userData != null) {
      const secret = userData._id + process.env.SECRET_KEY;
      const token = jwt.sign({ userID: userData._id }, secret, {
        expiresIn: "20m",
      });
      const link = `http://127.0.0.1:3000/user/reset-password/${userData._id}/${token}`;
      let info = await transporter.sendMail({
        from: "aditya.ca777@gmail.com",
        to: userEmail,
        subject: "Email for user reset password",
        html: `<a href=${link}>click here</a>`,
      });
      return res.status(201).json({
        success: true,
        message: "Email sent sucessfully",
        token: token,
        userID: userData._id,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Please enter valid email",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error occur ${error.message}`,
    });
  }
};

//Reset Password from url API
let resetPassword = async (req, res) => {
  const { id, token } = req.params;
  let { newPassword, confirmPassword } = req.body;
  try {
    const checkUser = await userSchema.findById(id);
    if (checkUser != null) {
      const secretKey = checkUser._id + process.env.SECRET_KEY;
      jwt.verify(token, secretKey);
      if (newPassword === confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(confirmPassword, salt);
        await userSchema.findByIdAndUpdate(checkUser._id, {
          $set: { userPassword: bcryptPassword },
        });
        res.status(203).json({
          success: true,
          message: "Password reset successfully",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "New password and confirm password is not same",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "User id is not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error occur ${error.message}`,
    });
  }
};

module.exports = {
  createUser,
  userLogin,
  sendResetLink,
  resetPassword,
};
//const { unlink } = require('../routes/companyRoute');
