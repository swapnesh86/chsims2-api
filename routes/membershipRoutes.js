const express = require('express')
const router = express.Router()
const membershipController = require('../controllers/membershipController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(membershipController.getAllMembership)
    .post(membershipController.createNewMembership)
    .patch(membershipController.updateMembership)
    .delete(membershipController.deleteMembership)


module.exports = router