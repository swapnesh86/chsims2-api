const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendanceController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')

router.use(verifyJWT)
router.use(verifyRoles(
    ROLES_LIST.Admin,
    ROLES_LIST.AccountsManager,
    ROLES_LIST.ShopManager,
    ROLES_LIST.AdInCharge,
    ROLES_LIST.PoInCharge,
    ROLES_LIST.BaInCharge
))

router.route('/')
    .get(attendanceController.getAllAttendance)
    .post(attendanceController.createNewAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)


module.exports = router