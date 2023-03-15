const CommissionList = require('../models/Commission')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllCommission = asyncHandler(async (req, res) => {
    const commission = await CommissionList.find().lean()
    if (!commission?.length) {
        return res.status(400).json({ message: 'No commissions found' })
    }
    res.json(commission)
})

// @desc - Create new users
// @route POST /users
// @access Private
// This is not really needed except at the begining
const createNewCommission = asyncHandler(async (req, res) => {
    const { adlow, admid, adhigh, balow, bamid, bahigh, polow, pomid, pohigh, exlow, exmid, exhigh } = req.body

    // Confirm Data
    /* if (!adlow || !admid || !adhigh || !balow || !bamid|| !bahigh || !polow || !pomid || !pohigh || !exlow || !exmid || !exhigh) {
        return res.status(400).json({ message: 'All fields are needed to add commission values row' })
    } */

    const commissionObject = { adlow, admid, adhigh, balow, bamid, bahigh, polow, pomid, pohigh, exlow, exmid, exhigh }

    //Create and store new user
    const commission = await CommissionList.create(commissionObject)

    if (commission) {
        res.status(201).json({ message: `New commission value created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateCommission = asyncHandler(async (req, res) => {
    const { id, adlow, admid, adhigh, balow, bamid, bahigh, polow, pomid, pohigh, exlow, exmid, exhigh } = req.body

    // Confirm Data
    if (!adlow || !admid || !adhigh || !balow || !bamid || !bahigh || !polow || !pomid || !pohigh || !exlow || !exmid || !exhigh) {
        return res.status(400).json({ message: 'All fields are needed for an update to commission targets' })
    }

    const commission = await CommissionList.findById(id).exec()

    if (!commission) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    // I think this is not needed - since we will never want to update a barcode. 
    /* const duplicate = await CommissionList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    commission.adlow = adlow
    commission.admid = admid
    commission.adhigh = adhigh
    commission.balow = balow
    commission.bamid = bamid
    commission.bahigh = bahigh
    commission.polow = polow
    commission.pomid = pomid
    commission.pohigh = pohigh
    commission.exlow = exlow
    commission.exmid = exmid
    commission.exhigh = exhigh

    const updatedcommission = await commission.save()

    res.json({ message: `Commission targets updated` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
// This is not really needed
const deleteCommission = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const commission = await CommissionList.findById(id).exec()

    if (!commission) {
        return res.status(400).json({ message: 'Commission entry not found' })
    }

    const result = await commission.deleteOne()

    const reply = `Commission entry deleted`

    res.json(reply)
})

module.exports = {
    getAllCommission,
    createNewCommission,
    updateCommission,
    deleteCommission
}