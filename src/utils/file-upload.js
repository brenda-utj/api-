const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  accessKeyId: process.env.AWS_ACCESSKEYID,
  region: 'us-east-2'
});
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: 'test metadata'});
    },
    key: (req, file, cb) => {
      const myArr = file.originalname.split(".");
      let tipo = myArr[myArr.length-1];
      cb(null, Date.now().toString()+"."+tipo);
    }
  })
});

module.exports = upload;