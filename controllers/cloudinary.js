const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.uploadImage = async (req, res) => {
  const { image } = req.body
  try {
    let result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    })
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Image upload failed',
    })
  }
}

exports.removeImage = async (req, res) => {
  let image_id = req.body.public_id
  try {
    await cloudinary.uploader.destroy(image_id, (err, result) => {
      if (err) {
        return res.json({ success: false, err })
      }
      res.send('ok')
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Image upload failed',
    })
  }
}
