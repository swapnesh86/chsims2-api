const express = require('express')
const router = express.Router()
const ledgerController = require('../controllers/ledgerController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(ledgerController.getAllLedger)
    .post(ledgerController.createNewLedger)
    .patch(ledgerController.updateLedger)
    .delete(ledgerController.deleteLedger)


module.exports = router