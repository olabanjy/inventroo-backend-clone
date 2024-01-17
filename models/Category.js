const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Category is required',
    },
    company_id: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)
