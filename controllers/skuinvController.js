const SkuinvList = require('../models/Skuinv')
const asyncHandler = require('express-async-handler')

// @desc - Get all users, optionally limited to the N most recently added
//         (by insertion order, via _id) when ?recent=N is passed
// @route GET /users
// @access Private
const getAllSkuinv = asyncHandler(async (req, res) => {
    const { recent } = req.query

    let query = SkuinvList.find()
    if (recent) {
        query = query.sort({ _id: -1 }).limit(Number(recent))
    }

    const skuinv = await query.lean()
    if (!skuinv?.length) {
        return res.status(400).json({ message: 'No skuinvs found' })
    }
    res.json(skuinv)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewSkuinv = asyncHandler(async (req, res) => {
    const { barcode, name, MRP, MBR, CP, HSNCode } = req.body

    // Confirm Data
    if (!barcode || !name || !MRP || !MBR || !CP || !HSNCode) {
        return res.status(400).json({ message: 'Barcode, Name, MRP, MBR, HSNCode are all mandatory fields for a new entry' })
    }

    // Check for duplicates 
    const duplicate = await SkuinvList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Barcode already exists - try updating fields instead' })
    }

    // Create object
    const skuinvObject = { barcode, name, MRP, MBR, CP, HSNCode }

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
    const { id, name, MRP, MBR, CP, HSNCode, source, cwefstore, andheri, bandra, powai, exhibition, sales } = req.body

    // Confirm Data
    const tempArr = [source, cwefstore, andheri, bandra, powai, exhibition, sales]
    const nonZeroValues = tempArr.map(val => Number(val) || 0).filter(val => val !== 0)
    const count = nonZeroValues.length

    // Confirm Data
    const validskuupdate = (name && MRP && MBR && CP && HSNCode && (count === 0))
    // An inventory update must move stock from one location to another, not create/destroy it -
    // the two non-zero fields must be equal and opposite (sum to 0).
    const validinvupdate = (count === 2 && !validskuupdate && (nonZeroValues[0] + nonZeroValues[1] === 0))

    if (!validinvupdate && !validskuupdate) {
        return res.status(400).json({ message: 'SKU update needs valid - name, mrp, mbr, cp, hsncode, and no inventory fields. Inventory update should not have name, mrp, mbr, hsncode and should have exactly 1 source and 1 destination location whose quantities are equal and opposite' })
    }

    // I think this is not needed - since we will never want to update a barcode.
    /* const duplicate = await SkuinvList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    // Atomic update - avoids the lost-update race of a findById -> mutate -> save
    // round trip when two inventory/transfer requests for the same SKU land close together.
    let update
    if (validinvupdate) {
        update = {
            $inc: {
                source: Number(source) || 0,
                cwefstore: Number(cwefstore) || 0,
                andheri: Number(andheri) || 0,
                bandra: Number(bandra) || 0,
                powai: Number(powai) || 0,
                exhibition: Number(exhibition) || 0,
                sales: Number(sales) || 0,
            }
        }
    } else {
        update = { $set: { name, MRP, MBR, CP, HSNCode } }
    }

    const updatedskuinv = await SkuinvList.findOneAndUpdate({ _id: id }, update, { new: true, runValidators: true })

    if (!updatedskuinv) {
        return res.status(400).json({ message: 'SkuInv entry not found' })
    }

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
