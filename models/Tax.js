const mongoose = require('mongoose')

const taxSchema = new mongoose.Schema(
  {
    tax_percentage: {
      type: Number,
      required: 'Tax is required',
    },
    company_id: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Tax', taxSchema)
