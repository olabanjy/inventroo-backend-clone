const express = require('express')
const router = express.Router()

const { authUser, authAdmin } = require('../middlewares/auth')

// controller
const { createInventory } = require('../controllers/inventory')

// routes
router.post('/inventory/create', authUser, authAdmin, createInventory)

module.exports = router
