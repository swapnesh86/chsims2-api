const BillNos = require('../models/BillNos')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllBillNos = asyncHandler(async (req, res) => {
    const billNos = await BillNos.find().lean()
    if (!billNos?.length) {
        return res.status(400).json({ message: 'No billNoss found' })
    }
    res.json(billNos)
})

/* // @desc - Create new users
// @route POST /users
// @access Private
const createNewBillNos = asyncHandler(async (req, res) => {
    const { ad, ba, po, ex, dn, db, os, int, ip, rs } = req.body
    //Confirm Data
    if (!barcode || !(cwefstore || andheri || bandra || powai || exhibition)) {
        return res.status(400).json({ message: 'Barcode and at least 1 location is mandatory to create new billNos entry' })
    }

    // Check for duplicates
    const duplicate = await BillNos.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Barcode already exists - try updating fields instead' })
    }

    // Create object
    const billNosObject = { barcode, cwefstore, andheri, bandra, powai, exhibition }

    //Create and store new user
    const billNos = await BillNos.create(billNosObject)

    if (billNos) {
        res.status(201).json({ message: `New billNos entry for: ${barcode} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

}) */

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateBillNos = asyncHandler(async (req, res) => {
    const { id, ad, ba, po, ex, dn, db, os, int, ip, rs, date } = req.body

    const fields = { ad, ba, po, ex, dn, db, os, int, ip, rs }
    const selected = Object.keys(fields).filter((key) => fields[key])

    // Confirm Data
    if (selected.length !== 1) {
        return res.status(400).json({ message: 'One and only one location can have a non-zero value for an update request' })
    }
    const field = selected[0]

    // Atomic update - avoids the lost-update race of a findById -> mutate -> save
    // round trip when two bill requests for the same location land close together.
    let update
    if (date) {
        const reset = { ad: 1, ba: 1, po: 1, ex: 1, db: 1, dn: 1, os: 1, int: 1, ip: 1, rs: 1, date }
        reset[field] = 2
        update = { $set: reset }
    } else {
        update = { $inc: { [field]: 1 } }
    }

    const updatedbillNos = await BillNos.findOneAndUpdate({ _id: id }, update, { new: true, runValidators: true })

    if (!updatedbillNos) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    res.json({ message: `Current Bill nos: ${JSON.stringify(updatedbillNos)} ` })

})

/* // @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteBillNos = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const billNos = await BillNos.findById(id).exec()

    if (!billNos) {
        return res.status(400).json({ message: 'BillNos entry not found' })
    }

    const result = await billNos.deleteOne()

    const reply = `Entry for: ${result.barcode} deleted`

    res.json(reply)
}) */

module.exports = {
    getAllBillNos,
    //createNewBillNos,
    updateBillNos,
    //deleteBillNos
}