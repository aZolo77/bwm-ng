const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');

const upload = require('../services/image-upload');
// to upload just one image at a time
const singleUpload = upload.single('image');

// route for image uploading to AWS
router.post('/image-upload', UserCtrl.authMiddlewear, function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image Upload Error', detail: err.message }]
      });
    }

    // return image URL
    return res.json({ imageUrl: req.file.location });
  });
});

module.exports = router;
