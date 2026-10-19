const userSchema = require("../models/userSchema");
const companyReviewSchema = require("../models/companyReviewSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../services/emailService");
const { unlinkSync } = require("fs");

//Create user api
let createUser = async (req, res) => {
  delete req.body.userRole; // roles are granted by an admin, never self-assigned at signup
  const userData = new userSchema(req.body);
  const salt = await bcrypt.genSalt(10);
  try {
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
      if (req.file) {
        userData.profilePic = `/uploads/user/${req.file.filename}`;
      }
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
      error: `Error occur ${error.message}`,
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
      const link = `${req.protocol}://${req.get("host")}/user/resetpassword/${userData._id}/${token}`;
      // SMTP email sending disabled locally — hardcoded OTP used instead.
      // let info = await transporter.sendMail({
      //   from: "abc.abc@gmail.com",
      //   to: userEmail,
      //   subject: "Email for user reset password",
      //   html: `<a href=${link}>click here</a>`,
      // });
      const otp = "435568"; // hardcoded local OTP
      return res.status(201).json({
        success: true,
        message: "OTP generated successfully (email sending disabled locally)",
        otp: otp,
        token: token,
        resetLink: link,
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
        res.status(200).json({
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

//List all users (admin)
let listUsers = async (req, res) => {
  try {
    const users = await userSchema.find().select("-userPassword").sort({ createdAt: -1 });
    res.status(200).json({ success: true, totalUsers: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error occur ${error.message}` });
  }
};

//Change a user's role (admin)
let updateUserRole = async (req, res) => {
  const { userRole } = req.body;
  if (!["user", "admin"].includes(userRole)) {
    return res.status(400).json({ success: false, message: "userRole must be 'user' or 'admin'" });
  }
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: "You can't change your own role" });
  }
  try {
    const user = await userSchema
      .findByIdAndUpdate(req.params.id, { userRole }, { new: true })
      .select("-userPassword");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error occur ${error.message}` });
  }
};

//Delete user and their reviews (admin)
let deleteUser = async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: "You can't delete your own account" });
  }
  try {
    const user = await userSchema.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await companyReviewSchema.deleteMany({ userId: req.params.id });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error occur ${error.message}` });
  }
};

module.exports = {
  listUsers,
  updateUserRole,
  deleteUser,
  createUser,
  userLogin,
  sendResetLink,
  resetPassword,
};
//const { unlink } = require('../routes/companyRoute');
