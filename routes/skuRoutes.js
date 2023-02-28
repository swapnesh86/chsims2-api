const express = require('express')
const router = express.Router()
const skuController = require('../controllers/skuController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(skuController.getAllSKUs)
    .post(skuController.createNewSKU)
    .patch(skuController.updateSKU)
    .delete(skuController.deleteSKU)


module.exports = router