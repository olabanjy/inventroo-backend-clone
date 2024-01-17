const express = require('express')
const router = express.Router()

const { authUser, authAdmin } = require('../middlewares/auth')

// controller
const {
  create,
  list,
  updateCategoryData,
  deleteCategory,
} = require('../controllers/category')

// routes
router.post('/category/create', authUser, authAdmin, create)
router.get('/categories/:company_id', list)
router.put('/update-category/:catId', authUser, authAdmin, updateCategoryData)
router.delete('/category-del/:id', authUser, authAdmin, deleteCategory)

module.exports = router
