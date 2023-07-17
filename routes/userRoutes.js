let express = require('express') ;
let user = require('../controller/userController')
let { registerUserValidation ,loginUserValidation,resetPassword} = require('../validation/userValidation/userDataValidation');
let {userAuthentication} = require('../middlewares/authToken');
let {upload}=require('../middlewares/imageStorage');

let router = express.Router();

router.post ('/create'  ,upload.single("profilePic"),registerUserValidation, user.createUser)
router.get('/login' ,loginUserValidation , user.userLogin)
router.get('/check' , userAuthentication , user.checktoken)
router.post('/varification' , user.resetUserPassword)
router.post('/resetpassword/:id/:token' ,resetPassword, user.resetPassword)

module.exports = router
