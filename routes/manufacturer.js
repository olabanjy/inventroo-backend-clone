const express = require('express')
const router = express.Router()

const { authUser, authAdmin } = require('../middlewares/auth')

// controller
const {
  create,
  list,
  updateManufacturerData,
  deleteManufacturer,
} = require('../controllers/manufacturer')

// routes
router.post('/manufacturer/create', authUser, authAdmin, create)
router.get('/manufacturers/:company_id', list)
router.put(
  '/update-manufacturer/:manuId',
  authUser,
  authAdmin,
  updateManufacturerData
)
router.delete('/manufacturer-del/:id', authUser, authAdmin, deleteManufacturer)

module.exports = router
