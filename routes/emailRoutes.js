const express = require('express')
const router = express.Router()
const emailController = require('../controllers/emailController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)
router.use(verifyRoles(
    ROLES_LIST.Admin,
    ROLES_LIST.ShopManager,
    ROLES_LIST.AdInCharge,
    ROLES_LIST.PoInCharge,
    ROLES_LIST.BaInCharge,
    ROLES_LIST.InventoryManager
))

router.route('/')
    .post(emailController.createNewEmail)

module.exports = router