const SkuinvList = require('../models/Skuinv')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllSkuinv = asyncHandler(async (req, res) => {
    const skuinv = await SkuinvList.find().lean()
    if (!skuinv?.length) {
        return res.status(400).json({ message: 'No skuinvs found' })
    }
    res.json(skuinv)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewSkuinv = asyncHandler(async (req, res) => {
    const { barcode, name, MRP, MBR, HSNCode } = req.body

    // Confirm Data
    if (!barcode || !name || !MRP || !MBR || !HSNCode) {
        return res.status(400).json({ message: 'Barcode, Name, MRP, MBR, HSNCode are all mandatory fields for a new entry' })
    }

    // Check for duplicates 
    const duplicate = await SkuinvList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Barcode already exists - try updating fields instead' })
    }

    // Create object
    const skuinvObject = { barcode, name, MRP, MBR, HSNCode }

    //Create and store new user
    const skuinv = await SkuinvList.create(skuinvObject)

    if (skuinv) {
        res.status(201).json({ message: `New skuinv entry for: ${barcode} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateSkuinv = asyncHandler(async (req, res) => {
    const { id, name, MRP, MBR, HSNCode, source, cwefstore, andheri, bandra, powai, exhibition, sales } = req.body

    // Confirm Data
    const tempArr = [source, cwefstore, andheri, bandra, powai, exhibition, sales]
    const count = tempArr.filter(Boolean).length

    // Confirm Data
    const validskuupdate = (name && MRP && MBR && HSNCode && (count === 0))
    const validinvupdate = (count === 2 && !validskuupdate)

    if (!validinvupdate && !validskuupdate) {
        return res.status(400).json({ message: 'SKU update needs valid - name, mrp, mbr, hsncode, and no inventory fields. Inventory update should not have name, mrp, mbr, hsncode and should have exactly 1 source and 1 destination' })
    }

    const skuinv = await SkuinvList.findById(id).exec()

    if (!skuinv) {
        return res.status(400).json({ message: 'SkuInv entry not found' })
    }

    // I think this is not needed - since we will never want to update a barcode. 
    /* const duplicate = await SkuinvList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    if (validinvupdate) {
        skuinv.source += Number(source)
        skuinv.cwefstore += Number(cwefstore)
        skuinv.andheri += Number(andheri)
        skuinv.bandra += Number(bandra)
        skuinv.powai += Number(powai)
        skuinv.exhibition += Number(exhibition)
        skuinv.sales += Number(sales)
    }
    else if (validskuupdate) {
        skuinv.name = name
        skuinv.MRP = MRP
        skuinv.MBR = MBR
        skuinv.HSNCode = HSNCode
    }

    const updatedskuinv = await skuinv.save()

    res.json({ message: `Current Qty for: ${updatedskuinv.barcode} = CWEFStore: ${updatedskuinv.cwefstore}, AD: ${updatedskuinv.andheri}, BA: ${updatedskuinv.bandra}, PO: ${updatedskuinv.powai}, EX: ${updatedskuinv.exhibition} ` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteSkuinv = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const skuinv = await SkuinvList.findById(id).exec()

    if (!skuinv) {
        return res.status(400).json({ message: 'Skuinv entry not found' })
    }

    const result = await skuinv.deleteOne()

    const reply = `Entry for: ${result.barcode} deleted`

    res.json(reply)
})

module.exports = {
    getAllSkuinv,
    createNewSkuinv,
    updateSkuinv,
    deleteSkuinv
}