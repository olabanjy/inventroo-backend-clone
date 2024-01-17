const Category = require('../models/Category')

exports.create = async (req, res) => {
  try {
    const { name, company_id } = req.body.newdata

    const findCategory = await Category.findOne({
      name: name,
      company_id: company_id,
    })

    if (findCategory) {
      return res.status(400).json({
        message: `Category '${name}' already exists'!`,
      })
    }

    const category = new Category({
      name: name,
      company_id: company_id,
    })

    await category.save()

    res.json(category)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.list = async (req, res) => {
  try {
    const { company_id } = req.params
    const categories = await Category.find({ company_id: company_id })

    if (!categories || categories.length === 0) {
      res.status(404).json({ message: 'No categories found for this company.' })
      return
    }

    res
      .status(200)
      .json({ message: 'Category retrieved successfully.', data: categories })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories.', error })
  }
}

exports.updateCategoryData = async (req, res) => {
  const { name } = req.body.catData

  try {
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.catId },
      {
        name,
      },
      { new: true }
    ).exec()
    res.json(updated)
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found.' })
      return
    }

    res.status(200).json({
      message: 'Category deleted successfully.',
      data: deletedCategory,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Category.', error })
  }
}
