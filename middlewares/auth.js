const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header('Authorization')

    const token = tmp ? tmp.slice(7, tmp.length) : ''

    if (!token) {
      return res.status(400).json({ message: 'Invalid Authentification' })
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: 'Invalid JWT Authentification' })
      }
      req.user = user
      next()
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.authAdmin = async (req, res, next) => {
  const { id } = req.user
  const adminUser = await User.findOne({ _id: id }).exec()
  if (adminUser.role !== 'admin') {
    res.status(403).json({
      err: 'Admin resource. Access denied',
    })
  } else {
    next()
  }
}

exports.authCompanyAdmin = async (req, res, next) => {
  const { id } = req.user
  const adminUser = await User.findOne({ _id: id }).exec()
  if (adminUser.role !== 'company_admin') {
    res.status(403).json({
      err: 'Admin resource. Access denied',
    })
  } else {
    next()
  }
}
