const express = require('express')
const router = express.Router()
const ledgerController = require('../controllers/ledgerController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)
router.use(verifyRoles(
    ROLES_LIST.Admin,
    ROLES_LIST.AccountsManager,
    ROLES_LIST.SkuManager,
    ROLES_LIST.ShopManager,
    ROLES_LIST.AdInCharge,
    ROLES_LIST.PoInCharge,
    ROLES_LIST.BaInCharge,
    ROLES_LIST.Employee,
    ROLES_LIST.InventoryManager
))

router.route('/')
    .get(ledgerController.getAllLedger)
    .post(ledgerController.createNewLedger)
    .patch(ledgerController.updateLedger)
    .delete(ledgerController.deleteLedger)


module.exports = router