const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const productGroupSchema = new Schema(
  {
    type: {
      type: String,
    },
    productGroupName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    unit: {
      type: String,
      required: true,
    },
    tax: {
      type: true,
    },
    manufacturer: {
      type: String,
    },
    brand: {
      type: String,
    },
    multipleProducts: [
      {
        _id: { type: String, required: true },
        attributes: { type: String, required: true },
        options: { type: String, required: true },
      },
    ],
    productType: {
      type: String,
    },
    openingStock: {
      type: String,
    },
    salesAccount: {
      type: String,
    },
    purchaseAccount: {
      type: String,
    },
    inventoryAccount: {
      type: String,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('ProductGroup', productGroupSchema)
