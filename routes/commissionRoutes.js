const express = require('express')
const router = express.Router()
const commissionController = require('../controllers/commissionController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(commissionController.getAllCommission)
    .post(commissionController.createNewCommission)
    .patch(commissionController.updateCommission)
    .delete(commissionController.deleteCommission)


module.exports = router