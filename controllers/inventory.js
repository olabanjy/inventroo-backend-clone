const Inventory = require('../models/InventoryAdjustment')
const Product = require('../models/Product')

exports.createInventory = async (req, res) => {
  try {
    const {
      modeOfAdjustment,
      approvedQuantity,
      approvedValue,
      referenceNumber,
      date,
      account,
      reason,
      description,
      invoiceAttachment,
      sendApprovalTo,
      companyId,
    } = req.body.newdata

    const existingInventory = await Inventory.findOne({
      referenceNumber,
      company_id: companyId,
    })

    // if (existingInventory) {
    //   return res.status(400).json({
    //     message: `Inventory with the same reference number (${referenceNumber}) already exists`,
    //   })
    // }

    const newInventory = new Inventory({
      company_id: companyId,
      modeOfAdjustment,
      approvedQuantity,
      approvedValue,
      referenceNumber,
      date,
      account,
      reason,
      description,
      invoiceAttachment,
      sendApprovalTo,
      companyId,
    })

    const savedInventory = await newInventory.save()

    const product = await Product.findOne({ referenceNumber })

    if (product) {
      const openingStock =
        parseFloat(product.openingStock) + parseFloat(approvedQuantity) || 0

      const costPrice =
        parseFloat(product.costPrice) + parseFloat(approvedValue) || 0

      product.openingStock = openingStock.toString()
      product.costPrice = costPrice.toString()

      await product.save()
    }
    res.json(savedInventory)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
