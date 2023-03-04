const express = require('express')
const router = express.Router()
const inventoryController = require('../controllers/inventoryController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(inventoryController.getAllInventory)
    .post(inventoryController.createNewInventory)
    .patch(inventoryController.updateInventory)
    .delete(inventoryController.deleteInventory)


module.exports = router