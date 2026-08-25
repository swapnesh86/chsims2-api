const express = require('express')
const router = express.Router()
const skuinvController = require('../controllers/skuinvController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)

router.route('/')
    .get(skuinvController.getAllSkuinv)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SkuManager), skuinvController.createNewSkuinv)
    .patch(skuinvController.updateSkuinv)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SkuManager), skuinvController.deleteSkuinv)


module.exports = router