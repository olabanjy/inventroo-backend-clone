const express = require('express')
const router = express.Router()

const { authUser, authAdmin } = require('../middlewares/auth')

// controller
const {
  createProduct,
  listProductsByCompanyId,
  deleteProduct,
  createProductCsv,
  productById,
  updateProduct,
} = require('../controllers/product')

// routes
router.post('/product/create', authUser, authAdmin, createProduct)
router.post('/product/create-csv', authUser, authAdmin, createProductCsv)
router.get(
  '/products/:company_id',
  authUser,
  authAdmin,
  listProductsByCompanyId
)
router.delete('/product-del/:id', authUser, authAdmin, deleteProduct)
router.get('/products-by-id/:id', authUser, authAdmin, productById)
router.put('/products-update/:productId', authUser, authAdmin, updateProduct)

module.exports = router
