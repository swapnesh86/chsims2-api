const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendanceController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(attendanceController.getAllAttendance)
    .post(attendanceController.createNewAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)


module.exports = router