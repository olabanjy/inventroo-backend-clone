const express = require('express')

const { authUser, authAdmin } = require('../middlewares/auth')
const {
  registerEmployee,
  getAllEmployees,
  verifyToken,
  getUsers,
  updateUserData,
  userResendLinkNew,
  setUserCredentials,
  deleteUser,
} = require('../controllers/employee')

const router = express.Router()

router.post('/register-employee', authUser, authAdmin, registerEmployee)
router.get('/employees', authUser, authAdmin, getAllEmployees)
router.get('/account/:token', verifyToken)
router.get('/get-users', authUser, authAdmin, getUsers)
router.put('/update-employee/:uId', authUser, authAdmin, updateUserData)
router.put('/user/resend-link/:uId', authUser, authAdmin, userResendLinkNew)
router.put('/set-credentials/:uId', setUserCredentials)
router.delete('/employee-del/:id', authUser, authAdmin, deleteUser)

module.exports = router
