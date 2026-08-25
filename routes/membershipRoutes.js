const express = require('express')
const router = express.Router()
const membershipController = require('../controllers/membershipController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)

router.route('/')
    .get(membershipController.getAllMembership)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ShopManager, ROLES_LIST.AdInCharge, ROLES_LIST.PoInCharge, ROLES_LIST.BaInCharge), membershipController.createNewMembership)
    .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ShopManager, ROLES_LIST.AdInCharge, ROLES_LIST.PoInCharge, ROLES_LIST.BaInCharge), membershipController.updateMembership)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ShopManager, ROLES_LIST.AdInCharge, ROLES_LIST.PoInCharge, ROLES_LIST.BaInCharge), membershipController.deleteMembership)


module.exports = router