const express = require('express')
const router = express.Router()
const membershipController = require('../controllers/membershipController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)
router.use(verifyRoles(
    ROLES_LIST.Admin,
    ROLES_LIST.ShopManager,
    ROLES_LIST.AdInCharge,
    ROLES_LIST.PoInCharge,
    ROLES_LIST.BaInCharge
))

router.route('/')
    .get(membershipController.getAllMembership)
    .post(membershipController.createNewMembership)
    .patch(membershipController.updateMembership)
    .delete(membershipController.deleteMembership)


module.exports = router