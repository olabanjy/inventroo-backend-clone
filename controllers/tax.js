const Tax = require('../models/Tax')

exports.create = async (req, res) => {
  try {
    const { name, company_id } = req.body.newdata

    const findTax = await Tax.findOne({
      tax_percentage: name,
      company_id: company_id,
    })

    if (findTax) {
      return res.status(400).json({
        message: `Tax '${name}' already exists'!`,
      })
    }

    const tax = new Tax({
      tax_percentage: name,
      company_id: company_id,
    })

    await tax.save()

    res.json(tax)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.list = async (req, res) => {
  try {
    const { company_id } = req.params
    const tax = await Tax.find({ company_id: company_id })

    if (!tax || tax.length === 0) {
      res.status(404).json({ message: 'No tax found for this company.' })
      return
    }

    res.status(200).json({
      message: 'Tax retrieved successfully.',
      data: tax,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tax.', error })
  }
}

exports.updateTaxData = async (req, res) => {
  const { name } = req.body.taxData

  try {
    const updated = await Tax.findOneAndUpdate(
      { _id: req.params.taxId },
      {
        tax_percentage: name,
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

exports.deleteTax = async (req, res) => {
  try {
    const { id } = req.params
    const deletedTax = await Tax.findByIdAndDelete(id)

    if (!deletedTax) {
      res.status(404).json({ message: 'Tax not found.' })
      return
    }

    res.status(200).json({
      message: 'Tax deleted successfully.',
      data: deletedTax,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Tax.', error })
  }
}
