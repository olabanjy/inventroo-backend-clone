const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const priceListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    itemRate: {
      type: String,
    },
    description: {
      type: String,
    },
    percentage: {
      type: String,
      required: true,
    },
    roundOffTo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('PriceList', priceListSchema)
