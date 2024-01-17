const bwipjs = require('bwip-js')

const generateBarcodeImage = async (barcodeValue) => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: 'code128',
        text: barcodeValue,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
        textyoffset: 2,
      },
      (err, png) => {
        if (err) {
          reject(err)
        } else {
          resolve(png)
        }
      }
    )
  })
}

module.exports = generateBarcodeImage
