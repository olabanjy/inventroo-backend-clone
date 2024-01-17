const express = require('express')
const router = express.Router()

const { authUser, authAdmin } = require('../middlewares/auth')

// controller
const { create, list, updateTaxData, deleteTax } = require('../controllers/tax')

// routes
router.post('/tax/create', authUser, authAdmin, create)
router.get('/taxes/:company_id', list)
router.put('/update-tax/:taxId', authUser, authAdmin, updateTaxData)
router.delete('/tax-del/:id', authUser, authAdmin, deleteTax)

module.exports = router
