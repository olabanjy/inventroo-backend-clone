const express = require('express')
const {
  registerUser,
  login,
  completeRegister,
  forgotPassword,
  forgotPasswordCode,
  forgotPasswordUpdate,
  readAllUsers,
  accountApproval,
  registerCompanyUser,
  updateUserInfo,
} = require('../controllers/user')

const { authUser, authAdmin, authCompanyAdmin } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/register-user', registerCompanyUser)
router.post('/login', login)
router.post('/completeregiter', completeRegister)
router.post('/forgotpassword', forgotPassword)
router.post('/forgotpasswordcode', forgotPasswordCode)
router.post('/forgotpasswordupdate', forgotPasswordUpdate)
router.get('/users', authUser, authCompanyAdmin, readAllUsers)
router.put('/isapproved', authUser, authCompanyAdmin, accountApproval)
router.put('/user/org-profile', authUser, authAdmin, updateUserInfo)

module.exports = router
