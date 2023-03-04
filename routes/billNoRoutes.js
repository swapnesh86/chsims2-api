const express = require('express')
const router = express.Router()
const billNoController = require('../controllers/billNoController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(billNoController.getAllBillNos)
    .patch(billNoController.updateBillNos)

module.exports = router