const SKUList = require('../models/SKU')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllSKUs = asyncHandler(async (req, res) => {
    const skus = await SKUList.find().lean()
    if (!skus?.length) {
        return res.status(400).json({ message: 'No skus found' })
    }
    res.json(skus)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewSKU = asyncHandler(async (req, res) => {
    const { Barcode, SKU, Name, MRP, MBR, HSNCode } = req.body
    //Confirm Data
    if (!Barcode || !Name || !MRP || !MBR || !HSNCode) {
        return res.status(400).json({ message: 'Barcode, Name, MRP, MBR, HSNCode are all mandatory fields' })
    }

    // Check for duplicates
    const duplicate = await SKUList.findOne({ Barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Barcode' })
    }

    // Hash Password
    const skuObject = { Barcode, SKU, Name, MRP, MBR, HSNCode }

    //Create and store new user
    const sku = await SKUList.create(skuObject)

    if (sku) {
        res.status(201).json({ message: `New barcode ${Barcode} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateSKU = asyncHandler(async (req, res) => {
    const { id, Barcode, Name, MRP, MBR, HSNCode } = req.body

    // Confirm Data
    if (!Barcode || !Name || !MRP || !MBR || !HSNCode) {
        return res.status(400).json({ message: 'Barcode, Name, MRP, MBR, HSNCode cannot be left blank' })
    }

    const sku = await SKUList.findById(id).exec()

    if (!sku) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    //Check for duplicate
    const duplicate = await SKUList.findOne({ Barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    }

    sku.Barcode = Barcode
    sku.SKU = Barcode
    sku.Name = Name
    sku.MRP = MRP
    sku.MBR = MBR
    sku.HSNCode = HSNCode

    const updatedsku = await sku.save()

    res.json({ message: `${updatedsku.Barcode} updated` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteSKU = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Barcode ID is required for DELETE' })
    }

    const sku = await SKUList.findById(id).exec()

    if (!sku) {
        return res.status(400).json({ message: 'SKU not found' })
    }

    const result = await sku.deleteOne()

    const reply = `Barcode ${result.Barcode} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllSKUs,
    createNewSKU,
    updateSKU,
    deleteSKU
}