const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const inventoryAdjustmentSchema = new Schema(
  {
    company_id: {
      type: String,
    },
    modeOfAdjustment: {
      type: String,
    },
    approvedQuantity: {
      type: String,
    },
    approvedValue: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    invoiceAttachment: {
      type: Array,
    },
    sendApprovalTo: {
      type: String,
    },
    lastModifiedDateTime: {
      type: String,
    },
  },
  { timestamps: true }
)

inventoryAdjustmentSchema.pre('save', function (next) {
  const currentTime = new Date()
  const formattedDateTime = currentTime.toLocaleString()
  this.lastModifiedDateTime = formattedDateTime
  next()
})

module.exports = mongoose.model(
  'InventoryAdjustment',
  inventoryAdjustmentSchema
)
