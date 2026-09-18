const multer = require('multer');
const path = require('path');

const imageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', '/uploads/company'));
  },
  filename: (req, file, callback) => {
    var ext = path.extname(file.originalname);
    callback(null, `image_${Date.now()}${ext}`);
  }
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Only images are allowed'));
  }
};

const companyUpload = multer({
  storage: imageConfig,
  fileFilter: isImage
});

module.exports = { companyUpload };
