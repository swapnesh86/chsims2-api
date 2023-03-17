const express = require('express')
const router = express.Router()
const skuinvController = require('../controllers/skuinvController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(skuinvController.getAllSkuinv)
    .post(skuinvController.createNewSkuinv)
    .patch(skuinvController.updateSkuinv)
    .delete(skuinvController.deleteSkuinv)


module.exports = router