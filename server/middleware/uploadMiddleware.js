const multer = require('multer');

// Memory storage to process buffer directly without persisting unneeded temp files on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const hasPdfExt = /\.pdf$/i.test(file.originalname);

  if (isPdfMime || hasPdfExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF documents (.pdf) are permitted.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

const uploadSinglePdf = (req, res, next) => {
  const handler = upload.single('resume');

  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds the 5MB limit. Please upload a smaller PDF resume.',
        });
      }
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    next();
  });
};

module.exports = {
  uploadSinglePdf,
};
