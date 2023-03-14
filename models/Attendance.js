const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    in_out: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    }
}
)


module.exports = mongoose.model('AttendanceList', AttendanceSchema)