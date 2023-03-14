const AttendanceList = require('../models/Attendance')
const asyncHandler = require('express-async-handler')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllAttendance = asyncHandler(async (req, res) => {
    const attendance = await AttendanceList.find().lean()
    if (!attendance?.length) {
        return res.status(400).json({ message: 'No attendances found' })
    }
    res.json(attendance)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewAttendance = asyncHandler(async (req, res) => {
    const { name, location, in_out, time } = req.body

    // Confirm Data
    if (!name || !location || !in_out || !time) {
        return res.status(400).json({ message: 'All fields are needed to create attendance row' })
    }

    /*     // Check for duplicates
        const duplicate = await AttendanceList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Barcode already exists - try updating fields instead' })
        }
     */
    // Create object
    const attendanceObject = { name, location, in_out, time }

    //Create and store new user
    const attendance = await AttendanceList.create(attendanceObject)

    if (attendance) {
        res.status(201).json({ message: `New attendance entry for: ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateAttendance = asyncHandler(async (req, res) => {
    const { id, name, location, in_out, time } = req.body

    // Confirm Data
    if (!name || !location || !in_out || !time) {
        return res.status(400).json({ message: 'All fields are needed for an update' })
    }

    const attendance = await AttendanceList.findById(id).exec()

    if (!attendance) {
        return res.status(400).json({ message: 'Entry not found' })
    }

    // I think this is not needed - since we will never want to update a barcode. 
    /* const duplicate = await AttendanceList.findOne({ barcode }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'You seem to be changing barcode to a value that already has an entry in the database' })
    } */

    if (name) attendance.name = name
    if (location) attendance.location = location
    if (in_out) attendance.in_out = in_out
    if (time) attendance.time = time

    const updatedattendance = await attendance.save()

    res.json({ message: `Updated attendance for: ${updatedattendance.name} with, Location: ${updatedattendance.location}, ${updatedattendance.in_out}, and time: ${updatedattendance.time}` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'ID is required for DELETE' })
    }

    const attendance = await AttendanceList.findById(id).exec()

    if (!attendance) {
        return res.status(400).json({ message: 'Attendance entry not found' })
    }

    const result = await attendance.deleteOne()

    const reply = `${result.in_out} entry for: ${result.name} at ${result.location} on ${result.time} deleted`

    res.json(reply)
})

module.exports = {
    getAllAttendance,
    createNewAttendance,
    updateAttendance,
    deleteAttendance
}