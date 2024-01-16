const express = require('express')

const { authUser, authAdmin } = require('../middlewares/auth')
const {
  addRole,
  getRole,
  editRole,
  deleteRole,
  getRoleById,
  cloneRole,
} = require('../controllers/role')

const router = express.Router()

router.post('/add-role', authUser, authAdmin, addRole)
router.get('/get-role', authUser, authAdmin, getRole)
router.get('/role-get/:id', authUser, authAdmin, getRoleById)
router.put('/role/:id', authUser, authAdmin, editRole)
router.delete('/role/:id', authUser, authAdmin, deleteRole)
router.post('/role/clone', authUser, authAdmin, cloneRole)

module.exports = router
