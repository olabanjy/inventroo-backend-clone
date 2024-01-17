const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const productSchema = new Schema(
  {
    type: {
      type: String,
    },
    product_name: {
      type: String,
      required: true,
    },
    company_id: {
      type: String,
    },
    sku: {
      type: Number,
    },
    unit: {
      type: String,
    },
    productImages: {
      type: Array,
      default:
        'https://res.cloudinary.com/dwn02nfdv/image/upload/v1690715008/product_icon_iwdozj.png',
    },
    returnAble: {
      type: Boolean,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    category: { type: ObjectId, ref: 'Category' },
    manufacturer: { type: ObjectId, ref: 'Manufacturer' },
    tax: { type: ObjectId, ref: 'Tax' },
    mpn: {
      type: String,
    },
    upc: {
      type: String,
    },
    isbn: {
      type: String,
    },
    ean: {
      type: String,
    },
    costPrice: {
      type: String,
    },
    sellingPrice: {
      type: String,
    },
    priceRate: {
      type: String,
    },
    description: {
      type: String,
    },
    rateType: {
      type: String,
    },
    percentage: {
      type: String,
    },
    roundOffTo: {
      type: String,
    },
    inventoryAccount: {
      type: String,
      required: true,
    },
    openingStock: {
      type: String,
    },
    openingStockRatePerUnit: {
      type: String,
    },
    reorderPoint: {
      type: String,
    },
    preferredVendor: {
      type: String,
    },
    barcodeImage: {
      data: Buffer,
      contentType: String,
    },
    addTax: {
      type: Boolean,
    },
    unitSold: {
      type: String,
      default: 0,
    },
    unitPrice: {
      type: String,
    },
    productAvailAbility: {
      type: Boolean,
      default: true,
    },
    referenceNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

productSchema.pre('save', function (next) {
  if (!this.referenceNumber) {
    const referenceNumber = `${this.company_id}${this.product_name.slice(
      0,
      3
    )}${this.sku}`

    this.referenceNumber = referenceNumber.toUpperCase()
  }
  next()
})

module.exports = mongoose.model('Product', productSchema)
