let express = require('express') ;
let company = require('../controller/companyController')
let {registerUserValidation} = require('../validation/comapnyValidation/companyDataValidation');
let {tokenVerification} = require('../middlewares/authToken');
let {companyUpload}= require('../middlewares/companyImageStorage')
let {authorizeAdmin}= require('../middlewares/authontication')

let router = express.Router();
router.post('/create',tokenVerification,authorizeAdmin,companyUpload.single("profilePic"),registerUserValidation,company.createCompany)
router.patch('/update/:id',tokenVerification,authorizeAdmin,companyUpload.single("profilePic"),company.updateCompany)
router.delete('/delete/:id',tokenVerification,authorizeAdmin,company.deleteCompany)

router.get('/list',company.companyList)
router.get('/review/:id',company.companyDetails);
router.post('/findcompanies',company.searchCompaniesByLetterWithBody);
router.get('/searchcompany/:letters',company.searchCompaniesByLetterWithParams);

module.exports = router
