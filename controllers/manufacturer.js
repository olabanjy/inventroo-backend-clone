const Manufacturer = require('../models/Manufacturer')

exports.create = async (req, res) => {
  try {
    const { name, company_id } = req.body.newdata

    const findManufacturer = await Manufacturer.findOne({
      name: name,
      company_id: company_id,
    })

    if (findManufacturer) {
      return res.status(400).json({
        message: `Manufacturer '${name}' already exists'!`,
      })
    }

    const manufacturer = new Manufacturer({
      name: name,
      company_id: company_id,
    })

    await manufacturer.save()

    res.json(manufacturer)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.list = async (req, res) => {
  try {
    const { company_id } = req.params
    const manufacturer = await Manufacturer.find({ company_id: company_id })

    if (!manufacturer || manufacturer.length === 0) {
      res
        .status(404)
        .json({ message: 'No manufacturer found for this company.' })
      return
    }

    res.status(200).json({
      message: 'Manufacturer retrieved successfully.',
      data: manufacturer,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving manufacturer.', error })
  }
}

exports.updateManufacturerData = async (req, res) => {
  const { name } = req.body.manuData

  try {
    const updated = await Manufacturer.findOneAndUpdate(
      { _id: req.params.manuId },
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

exports.deleteManufacturer = async (req, res) => {
  try {
    const { id } = req.params
    const deletedManufacturer = await Manufacturer.findByIdAndDelete(id)

    if (!deletedManufacturer) {
      res.status(404).json({ message: 'Manufacturer not found.' })
      return
    }

    res.status(200).json({
      message: 'Manufacturer deleted successfully.',
      data: deletedManufacturer,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Manufacturer.', error })
  }
}
