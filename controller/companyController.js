const companyReviewSchema = require("../models/companyReviewSchema");
let companySchema = require("../models/companySchema");
const {unlinkSync}=require('fs');

module.exports = {
  createCompany: async (req, res) => {
    try {
      let isCompanyExists = await companySchema.findOne({
        companyName: req.body.companyName,
      });
      if (isCompanyExists != null) {
        req.file ?unlinkSync(req.file.path):null;//agar same name ki company ho to profile pic upload na ho 
        res.status(401).json({
          success: false,
          message: "Company is already exist",
        });
      } else {
        let addCompany = new companySchema(req.body);
        const filePath=`/uploads/company/${req.file.filename}`;
        addCompany.profilePic=filePath;
        let company = await addCompany.save();
        res.status(201).json({
          success: true,
          message: "Company added successfully",
          company:company,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error:`Error occur ${error.message}`,
      });
    }
  },

  //company details
  companyList: async (req, res) => {
    try {
      let companys = await companySchema.find();
      let totalCompanies = await companySchema.find().count();
      res.status(200).json({
        success: true,
        totalCompanies: totalCompanies,
        companys: companys,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Error occur ${error.message}`,
      });
    }
  },

//company review details
companyDetails: async (req, res) => {
  try {
    const companyData = await companySchema.findById(req.params.id);
    const reviewDataList = await companyReviewSchema
    .find({companyId: req.params.id})
    .populate({path: "userId" ,select:"userName profilPic"});
    res.status(200).json({
      success:true,
      message:"Review list fetched successfully",
      company: companyData,
      review: reviewDataList
    }) 
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error occur ${error.message}`,
    });
  }
},

//Get company name by letters
searchCompaniesByLetterWithBody: async (req, res)=>{
  try{
    let companysByLetter= await req.body.companyByLetter;
    console.log(req.body.companyByLetter);
    let companies = await companySchema.find({
      companyName: {$regex: `^${companysByLetter}`, $options: "i"},
    })
    if(companies.length>0){
        res.status(200).json({
        success:true,
        message: "Company found successfully",
        companies:companies
       })
    }else{
        res.status(400).json({
        success:false,
        message: "Companys are not exists "
       })  
    }
  }catch(error){
    res.status(500).json({
      success: false,
      error:`Error occur ${error.message}`,
    });

  }
},

//Get company name by letters with params
searchCompaniesByLetterWithParams: async (req, res)=>{
  try{
    let {letters}=req.params;
    //console.log(companyName);
    let companies = await companySchema.find({
      companyName: {$regex: `^${letters}`, $options: "i"},
    })
    if(companies.length>0){
        res.status(200).json({
        success:true,
        message: "Company found successfully",
        companies:companies
       })
    }else{
        res.status(400).json({
        success:false,
        message: "Companys are not exists "
       })  
    }
  }catch(error){
    res.status(500).json({
      success: false,
      error:`Error occur ${error.message}`,
    });

  }
},
};
