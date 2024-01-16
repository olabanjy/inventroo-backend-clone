const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: ObjectId, ref: 'Role', required: true },
    company: { type: ObjectId, ref: 'User', required: true },
    personal_phone: { type: String },
    profile_image_link: {
      type: String,
      default:
        'https://res.cloudinary.com/dwn02nfdv/image/upload/v1661767397/user_e33pcx.png',
    },
    isBlocked: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    pin: { type: String },
    password: { type: String },
    registerToken: { type: String },
    registerTokenExpires: { type: Date },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Employee', employeeSchema)
