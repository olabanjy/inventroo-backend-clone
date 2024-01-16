const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const UserSchema = new Schema(
  {
    account_type: {
      type: String,
      text: true,
    },
    business_name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      text: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    business_email: {
      type: String,
      trim: true,
    },
    business_company: {
      type: String,
      trim: true,
      text: true,
    },
    business_category: {
      type: String,
      text: true,
    },
    company_reg_num: {
      type: String,
      text: true,
    },
    business_tax_id: {
      type: String,
      text: true,
    },
    business_phone: {
      type: String,
      text: true,
    },
    business_website: {
      type: String,
      text: true,
    },
    business_home_add1: {
      type: String,
      text: true,
    },
    business_home_add2: {
      type: String,
      text: true,
    },
    business_city: {
      type: String,
      text: true,
    },
    business_state: {
      type: String,
      text: true,
    },
    business_country: {
      type: String,
      text: true,
    },
    business_fiscal_year_from: {
      type: Date,
      trim: true,
    },
    business_fiscal_year_to: {
      type: Date,
      trim: true,
    },
    first_name: {
      type: String,
      trim: true,
      text: true,
    },
    middle_name: {
      type: String,
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      trim: true,
      text: true,
    },
    unique_company_id: {
      type: String,
      trim: true,
    },
    registered_home_add: {
      type: String,
      text: true,
    },
    personal_phone: {
      type: String,
      text: true,
    },
    personal_city: {
      type: String,
      text: true,
    },
    personal_state: {
      type: String,
      text: true,
    },
    personal_country: {
      type: String,
      text: true,
    },
    profile_image_link: {
      type: String,
      default:
        'https://res.cloudinary.com/dwn02nfdv/image/upload/v1661767397/user_e33pcx.png',
    },
    payout_business_name: {
      type: String,
      text: true,
    },
    payout_account_num: {
      type: String,
      text: true,
    },
    payout_account_bank_name: {
      type: String,
      text: true,
    },
    payout_account_bank_bvn: {
      type: String,
      text: true,
    },
    payout_account_country: {
      type: String,
      text: true,
    },
    pin: {
      type: Number,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['company_admin', 'admin', 'cashier', 'manager'],
    },

    verifyOtp: {
      type: String,
    },
    tokenExpired: {
      type: Date,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetCode: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
