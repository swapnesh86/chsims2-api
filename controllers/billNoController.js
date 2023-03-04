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
    const { id, ad, ba, po, ex, dn, db, os, int, ip, rs } = req.body

    const tempArr = [ad, ba, po, ex, dn, db, os, int, ip, rs]
    const count = tempArr.filter(Boolean).length
    // Confirm Data
    if (count !== 1) {
        return res.status(400).json({ message: 'One and only one location can have a non-zero value for an update request' })
    }

    const billNos = await BillNos.findById(id).exec()

    if (!billNos) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    if (ad) billNos.ad += 1
    else if (ba) billNos.ba += 1
    else if (po) billNos.po += 1
    else if (ex) billNos.ex += 1
    else if (db) billNos.db += 1
    else if (dn) billNos.dn += 1
    else if (os) billNos.os += 1
    else if (int) billNos.int += 1
    else if (ip) billNos.ip += 1
    else if (rs) billNos.rs += 1

    const updatedbillNos = await billNos.save()

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