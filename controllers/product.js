const generateBarcodeImage = require('../helpers/generateBarcodeImage')
const Product = require('../models/Product')

const Papa = require('papaparse')

exports.createProduct = async (req, res) => {
  try {
    const {
      type,
      product_name,
      companyId,
      sku,
      unit,
      productImages,
      weight,
      width,
      height,
      category,
      manufacturer,
      tax,
      mpn,
      upc,
      isbn,
      ean,
      costPrice,
      sellingPrice,
      account,
      priceRate,
      description,
      percentage,
      roundOffTo,
      inventoryAccount,
      openingStock,
      openingStockRatePerUnit,
      reorderPoint,
      preferredVendor,
      returnAble,
      rateType,
      addTax,
    } = req.body.newdata

    const existingProductBySku = await Product.findOne({
      sku,
      company_id: companyId,
    })
    if (existingProductBySku) {
      return res
        .status(400)
        .json({ message: `Product with the same SKU (${sku}) already exists` })
    }

    // Check if product name already exists for the company
    const existingProductByName = await Product.findOne({
      product_name,
      company_id: companyId,
    })
    if (existingProductByName) {
      return res.status(400).json({
        message: `Product with the same name (${product_name}) already exists for the company`,
      })
    }

    const barcodeValue = ean || sku

    const barcodeImage = await generateBarcodeImage(barcodeValue)

    const newProduct = new Product({
      type,
      product_name,
      company_id: companyId,
      sku,
      unit,
      productImages,
      category,
      manufacturer,
      tax,
      weight,
      width,
      height,
      returnAble,
      mpn,
      upc,
      isbn,
      ean,
      costPrice,
      sellingPrice,
      account,
      priceRate,
      description,
      percentage,
      roundOffTo,
      inventoryAccount,
      openingStock,
      openingStockRatePerUnit,
      reorderPoint,
      preferredVendor,
      rateType,
      addTax,
      barcodeImage: {
        data: barcodeImage,
        contentType: 'image/png',
      },
    })

    const savedProduct = await newProduct.save()

    res.json(savedProduct)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.listProductsByCompanyId = async (req, res) => {
  try {
    const { company_id } = req.params

    const products = await Product.find({ company_id })
      .populate('category')
      .populate('tax')

    if (!products || products.length === 0) {
      res.status(404).json({ message: 'No products found.' })
      return
    }

    res.json(products)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.productById = async (req, res) => {
  try {
    const { id } = req.params

    const products = await Product.find({ _id: id })
      .populate('category')
      .populate('tax')
      .populate('manufacturer')

    if (!products || products.length === 0) {
      res.status(404).json({ message: 'No products found.' })
      return
    }

    res.json(products)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const {
      type,
      product_name,
      companyId,
      unit,
      productImages,
      dimensions,
      weight,
      width,
      height,
      category,
      manufacturer,
      tax,
      mpn,
      upc,
      isbn,
      ean,
      costPrice,
      sellingPrice,
      account,
      priceRate,
      description,
      percentage,
      roundOffTo,
      inventoryAccount,
      openingStock,
      openingStockRatePerUnit,
      reorderPoint,
      preferredVendor,
      returnAble,
      rateType,
      addTax,
    } = req.body.newdata

    const existingProduct = await Product.findOne({
      _id: req.params.productId,
      company_id: companyId,
    })

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const existingProductByName = await Product.findOne({
      product_name,
      company_id: companyId,
      _id: { $ne: req.params.productId },
    })

    if (existingProductByName) {
      return res.status(400).json({
        message: `Product with the same name (${product_name}) already exists for the company`,
      })
    }

    existingProduct.type = type
    existingProduct.product_name = product_name
    existingProduct.unit = unit
    existingProduct.productImages = productImages
    existingProduct.dimensions = dimensions
    existingProduct.weight = weight
    existingProduct.width = width
    existingProduct.height = height
    existingProduct.category = category
    existingProduct.manufacturer = manufacturer
    existingProduct.tax = tax
    existingProduct.mpn = mpn
    existingProduct.upc = upc
    existingProduct.isbn = isbn
    existingProduct.ean = ean
    existingProduct.costPrice = costPrice
    existingProduct.sellingPrice = sellingPrice
    existingProduct.account = account
    existingProduct.priceRate = priceRate
    existingProduct.description = description
    existingProduct.percentage = percentage
    existingProduct.roundOffTo = roundOffTo
    existingProduct.inventoryAccount = inventoryAccount
    existingProduct.openingStock = openingStock
    existingProduct.openingStockRatePerUnit = openingStockRatePerUnit
    existingProduct.reorderPoint = reorderPoint
    existingProduct.preferredVendor = preferredVendor
    existingProduct.returnAble = returnAble
    existingProduct.rateType = rateType
    existingProduct.addTax = addTax

    const updatedProduct = await existingProduct.save()

    res.json(updatedProduct)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// exports.createProductCsv = async (req, res) => {
//   try {
//     const { companyId, category } = req.body.companyOtherInfo
//     const csvData = req.body.csvData

//     if (!csvData || !Array.isArray(csvData)) {
//       return res.status(400).json({ message: 'Please provide valid CSV data' })
//     }

//     const conflictingProducts = []

//     for (const row of csvData) {
//       const {
//         product_name,
//         sku,
//         unit,
//         productImages,
//         weight,
//         manufacturer,
//         mpn,
//         upc,
//         isbn,
//         ean,
//         costPrice,
//         sellingPrice,
//         inventoryAccount,
//         openingStock,
//         openingStockRatePerUnit,
//         reorderPoint,
//       } = row

//       const existingProductBySku = await Product.findOne({
//         sku,
//         company_id: companyId,
//       })

//       if (existingProductBySku) {
//         conflictingProducts.push({
//           sku,
//           product_name,
//         })
//       } else {
//         const barcodeValue = sku

//         const barcodeImage = await generateBarcodeImage(barcodeValue)

//         const newProduct = new Product({
//           product_name,
//           company_id: companyId,
//           sku,
//           unit,
//           productImages,
//           category,
//           manufacturer,
//           weight,
//           mpn,
//           upc,
//           isbn,
//           ean,
//           costPrice,
//           sellingPrice,
//           inventoryAccount,
//           openingStock,
//           openingStockRatePerUnit,
//           reorderPoint,
//           barcodeImage: {
//             data: barcodeImage,
//             contentType: 'image/png',
//           },
//         })

//         await newProduct.save()
//       }
//     }

//     if (conflictingProducts.length > 0) {
//       return res.status(400).json({
//         message: 'Some products could not be imported due to SKU conflicts',
//         conflictingProducts,
//       })
//     }

//     res.json({ message: 'Products successfully added from CSV' })
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     })
//   }
// }

exports.createProductCsv = async (req, res) => {
  try {
    const { companyId, category } = req.body.companyOtherInfo
    const csvData = req.body.csvData

    if (!csvData || !Array.isArray(csvData)) {
      return res.status(400).json({ message: 'Please provide valid CSV data' })
    }

    // Check for fields that do not match the database model
    const validFields = [
      'product_name',
      'sku',
      'unit',
      'productImages',
      'weight',
      'height',
      'description',
      'mpn',
      'upc',
      'isbn',
      'ean',
      'costPrice',
      'sellingPrice',
      'inventoryAccount',
      'openingStock',
      'openingStockRatePerUnit',
      'reorderPoint',
      'unitPrice',
    ]

    const invalidFields =
      csvData[0] &&
      Object.keys(csvData[0]).filter((field) => !validFields.includes(field))
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Fields (${invalidFields.join(
          ', '
        )}) are not valid. Fields name should not be changed on the CSV document.`,
        invalidFields,
      })
    }

    const conflictingProducts = []

    for (const row of csvData) {
      const {
        product_name,
        sku,
        unit,
        productImages,
        weight,
        height,
        description,
        mpn,
        upc,
        isbn,
        ean,
        costPrice,
        sellingPrice,
        inventoryAccount,
        openingStock,
        openingStockRatePerUnit,
        reorderPoint,
        unitPrice,
      } = row

      const existingProductBySku = await Product.findOne({
        sku,
        company_id: companyId,
      })

      if (existingProductBySku) {
        conflictingProducts.push({
          sku,
          product_name,
        })
      } else {
        const barcodeValue = sku

        const barcodeImage = await generateBarcodeImage(barcodeValue)

        const newProduct = new Product({
          product_name,
          company_id: companyId,
          sku,
          unit,
          productImages,
          category,
          weight,
          height,
          description,
          mpn,
          upc,
          isbn,
          ean,
          costPrice,
          sellingPrice,
          inventoryAccount,
          openingStock,
          openingStockRatePerUnit,
          reorderPoint,
          unitPrice,
          barcodeImage: {
            data: barcodeImage,
            contentType: 'image/png',
          },
        })

        await newProduct.save()
      }
    }

    if (conflictingProducts.length > 0) {
      return res.status(400).json({
        message: 'Some products could not be imported due to SKU conflicts',
        conflictingProducts,
      })
    }

    res.json({ message: 'Products successfully added from CSV' })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found.' })
      return
    }

    res.status(200).json({
      message: 'Product deleted successfully.',
      data: deletedProduct,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Product.', error })
  }
}
