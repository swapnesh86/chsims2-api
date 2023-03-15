const MembershipList = require('../models/Membership')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllMembership = asyncHandler(async (req, res) => {
    const membership = await MembershipList.find().lean()
    if (!membership?.length) {
        return res.status(400).json({ message: 'No memberships found' })
    }
    res.json(membership)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewMembership = asyncHandler(async (req, res) => {
    const { barcode, phone, duration, billno, time } = req.body

    //Confirm Data
    if (!barcode || !phone || !duration || !billno || !time) {
        return res.status(400).json({ message: 'Membership Number, phone number, duration and billno are mandatory to create new membership entry' })
    }

    // Check for duplicates
    const duplicate = await MembershipList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Membership already exists - try updating fields instead' })
    }

    // Create object
    const membershipObject = { barcode, phone, duration, billno, time }

    //Create and store new user
    const membership = await MembershipList.create(membershipObject)

    if (membership) {
        res.status(201).json({ message: `New membership entry for: ${barcode} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateMembership = asyncHandler(async (req, res) => {
    const { id, barcode, phone, duration, billno, time } = req.body

    // Confirm Data
    if (!(barcode || phone) || !duration || !billno || !time) {
        return res.status(400).json({ message: 'Specify Membership Number/Phone along withmembership duration and bill number for an update request' })
    }

    const membership = await MembershipList.findById(id).exec()

    if (!membership) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    // I think this is not needed - since we will never want to update a barcode. 
    /* const duplicate = await MembershipList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    membership.phone = phone
    membership.prevbillnos = [...membership.prevbillnos, membership.billno]
    membership.billno = billno
    membership.duration = duration
    membership.time = time

    const updatedmembership = await membership.save()

    res.json({ message: `Membership no: ${updatedmembership.barcode} updated` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteMembership = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const membership = await MembershipList.findById(id).exec()

    if (!membership) {
        return res.status(400).json({ message: 'Membership entry not found' })
    }

    const result = await membership.deleteOne()

    const reply = `Entry for: ${result.barcode} deleted`

    res.json(reply)
})

module.exports = {
    getAllMembership,
    createNewMembership,
    updateMembership,
    deleteMembership
}