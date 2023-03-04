const InventoryList = require('../models/Inventory')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllInventory = asyncHandler(async (req, res) => {
    const inventory = await InventoryList.find().lean()
    if (!inventory?.length) {
        return res.status(400).json({ message: 'No inventorys found' })
    }
    res.json(inventory)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewInventory = asyncHandler(async (req, res) => {
    const { barcode, source, cwefstore, andheri, bandra, powai, exhibition, sales } = req.body

    // Confirm Data
    const tempArr = [source, cwefstore, andheri, bandra, powai, exhibition, sales]
    const count = tempArr.filter(Boolean).length

    if (count !== 2) {
        return res.status(400).json({ message: 'Quantity in source and destination must be the same and only 1 source and 1 destination can be specified for an update request' })
    }


    // Check for duplicates
    const duplicate = await InventoryList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Barcode already exists - try updating fields instead' })
    }

    // Create object
    const inventoryObject = { barcode, source, cwefstore, andheri, bandra, powai, exhibition, sales }

    //Create and store new user
    const inventory = await InventoryList.create(inventoryObject)

    if (inventory) {
        res.status(201).json({ message: `New inventory entry for: ${barcode} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateInventory = asyncHandler(async (req, res) => {
    const { id, source, cwefstore, andheri, bandra, powai, exhibition, sales } = req.body

    // Confirm Data
    const tempArr = [source, cwefstore, andheri, bandra, powai, exhibition, sales]
    const count = tempArr.filter(Boolean).length

    if (count !== 2) {
        return res.status(400).json({ message: 'Quantity in source and destination must be the same and only 1 source and 1 destination can be specified for an update request' })
    }

    const inventory = await InventoryList.findById(id).exec()

    if (!inventory) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    // I think this is not needed - since we will never want to update a barcode. 
    /* const duplicate = await InventoryList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    inventory.source -= Number(source)
    inventory.cwefstore += Number(cwefstore)
    inventory.andheri += Number(andheri)
    inventory.bandra += Number(bandra)
    inventory.powai += Number(powai)
    inventory.exhibition += Number(exhibition)
    inventory.sales += Number(sales)

    const updatedinventory = await inventory.save()

    res.json({ message: `Current Qty for: ${updatedinventory.barcode} = CWEFStore: ${updatedinventory.cwefstore}, AD: ${updatedinventory.andheri}, BA: ${updatedinventory.bandra}, PO: ${updatedinventory.powai}, EX: ${updatedinventory.exhibition} ` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteInventory = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const inventory = await InventoryList.findById(id).exec()

    if (!inventory) {
        return res.status(400).json({ message: 'Inventory entry not found' })
    }

    const result = await inventory.deleteOne()

    const reply = `Entry for: ${result.barcode} deleted`

    res.json(reply)
})

module.exports = {
    getAllInventory,
    createNewInventory,
    updateInventory,
    deleteInventory
}