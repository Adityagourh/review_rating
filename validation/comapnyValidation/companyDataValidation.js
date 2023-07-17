let schema= require('./companyValSchema');
const {unlinkSync}=require('fs');

module.exports = {
  registerUserValidation: async (req, res, next) => {
    const value = await schema.registerCompany.validate(req.body, {
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
}