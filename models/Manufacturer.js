const mongoose = require('mongoose')

const manufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Manufacturer is required',
    },
    company_id: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Manufacturer', manufacturerSchema)
