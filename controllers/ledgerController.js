const LedgerList = require('../models/Ledger')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllLedger = asyncHandler(async (req, res) => {
    const ledger = await LedgerList.find().lean()
    if (!ledger?.length) {
        return res.status(400).json({ message: 'No ledgers found' })
    }
    res.json(ledger)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewLedger = asyncHandler(async (req, res) => {
    const { billno, barcode, name, ordertype, buyer, seller, phone, email, paymenttype, membership, qty, totalprice, hsncode, gst } = req.body
    //Confirm Data
    if (!billno || !barcode || !name || !ordertype || !buyer || !seller || !paymenttype || !qty || !hsncode || !gst) {
        return res.status(400).json({ message: 'Billno, barcode, ordertype, buyer, seller, paymenttype, qty, hsncode, gst are all mandatory fields' })
    }

    // Create object
    const ledgerObject = { billno, barcode, name, ordertype, buyer, seller, phone, email, paymenttype, membership, qty, totalprice, hsncode, gst }

    //Create and store new user
    const ledger = await LedgerList.create(ledgerObject)

    if (ledger) {
        res.status(201).json({ message: `New ledger entry with bill no: ${billno} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateLedger = asyncHandler(async (req, res) => {
    const { id, billno, barcode, ordertype, buyer, seller, phone, email, paymenttype, membership, qty, totalprice, hsncode, gst } = req.body

    // Confirm Data
    if (!billno || !barcode || !ordertype || !buyer || !seller || !paymenttype || !qty || !totalprice || !hsncode || !gst) {
        return res.status(400).json({ message: 'Billno, barcode, ordertype, buyer, seller, paymenttype, qty, totalprice, hsncode, gst cannot be left blank' })
    }

    const ledger = await LedgerList.findById(id).exec()

    if (!ledger) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    ledger.billno = billno
    ledger.barcode = barcode
    ledger.ordertype = ordertype
    ledger.buyer = buyer
    ledger.seller = seller
    ledger.phone = phone
    ledger.email = email
    ledger.paymenttype = paymenttype
    ledger.membership = membership
    ledger.qty = qty
    ledger.totalprice = totalprice
    ledger.hsncode = hsncode
    ledger.gst = gst

    const updatedledger = await ledger.save()

    res.json({ message: `Bill no: ${updatedledger.billno}, Product: ${barcode} updated` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteLedger = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const ledger = await LEDGERList.findById(id).exec()

    if (!ledger) {
        return res.status(400).json({ message: 'Ledger entry not found' })
    }

    const result = await ledger.deleteOne()

    const reply = `Bill no: ${result.billno}, Product: ${result.barcode}, Qty: ${result.qty} - with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllLedger,
    createNewLedger,
    updateLedger,
    deleteLedger
}