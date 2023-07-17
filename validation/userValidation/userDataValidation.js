const schema = require("./userValShema");
const {unlinkSync} = require('fs');
module.exports = {
  registerUserValidation: async (req, res, next) => {
    const value = await schema.registerUser.validate(req.body, {
      abortEarly: false,
    });
    if (value.error) {
      req.file ? unlinkSync(req.file.path):null;//agar same name ki company ho to profile pic upload na ho 
      res.status(403).json({
        success: false,
        message: value.error.details[0].message,
      });
    } else {
      next();
    }
  },

  //User login validation
  
  loginUserValidation: async (req, res, next) => {
    const value = await schema.loginUserValidation.validate(req.body, {
      abortEarly: false,
    });
    if (value.error) {
      res.status(403).json({
        success: false,
        message: value.error.details[0].message,
      });
    } else {
      next();
    }
  },

  //reset password validation
  resetPassword: async (req, res, next) => {
    const value = await schema.resetPassword.validate(req.body, {
      abortEarly: false,
    });
    if (value.error) {
      res.status(403).json({
        success: false,
        message: value.error.details[0].message,
      });
    } else {
      next();
    }
  },

};
