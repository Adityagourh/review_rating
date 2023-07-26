let express = require('express') ;
let user = require('../controller/userController')
let { registerUserValidation ,loginUserValidation,resetPassword} = require('../validation/userValidation/userDataValidation');
let {tokenVerification} = require('../middlewares/authToken');
let {upload}=require('../middlewares/imageStorage');
let router = express.Router();

router.post ('/create'  ,upload.single("profilePic"),registerUserValidation, user.createUser)
router.post ('/login' ,loginUserValidation , user.userLogin)
router.post('/sendlink' , user.sendResetLink)
router.get('/resetpassword/:id/:token' ,resetPassword, user.resetPassword)

module.exports = router
