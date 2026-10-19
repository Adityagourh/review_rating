let express = require('express') ;
let user = require('../controller/userController')
let { registerUserValidation ,loginUserValidation,resetPassword} = require('../validation/userValidation/userDataValidation');
let {tokenVerification} = require('../middlewares/authToken');
let {upload}=require('../middlewares/imageStorage');
let {authorizeAdmin}=require('../middlewares/authontication');
let router = express.Router();

router.post ('/create', upload.single("profilePic"), registerUserValidation, user.createUser)
router.post ('/login', loginUserValidation, user.userLogin)
router.post('/sendlink', user.sendResetLink)
router.get('/resetpassword/:id/:token', resetPassword, user.resetPassword)

// admin
router.get('/list', tokenVerification, authorizeAdmin, user.listUsers)
router.patch('/role/:id', tokenVerification, authorizeAdmin, user.updateUserRole)
router.delete('/delete/:id', tokenVerification, authorizeAdmin, user.deleteUser)

module.exports = router
