const multer = require('multer');
const fs = require('fs');
const imageType = require('image-type');
const readChunk = require('read-chunk');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/server/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
  
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single('file');

exports.fileUpload = async (req, res) => {


    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({message: 'problem 1'})
        } else if (err) {
            return res.status(500).json({message: 'problem 2'})
        }

        const buffer = readChunk.sync(req.file.path, 0, 12);
        const image = imageType(buffer);
        if(!image) {
          fs.unlinkSync(req.file.path);
          return res.status(500).json({message: 'File is not an image!'})
        }
      
       return res.status(200).send(req.file)

    })

};