const express = require('express')
const router = express.Router()

// middlewares
const { authUser, authAdmin } = require('../middlewares/auth')

const { uploadImage, removeImage } = require('../controllers/cloudinary')

router.post('/upload-image', authUser, authAdmin, uploadImage)
router.post('/remove-image', authUser, authAdmin, removeImage)

module.exports = router
