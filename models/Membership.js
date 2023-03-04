const mongoose = require('mongoose')

const MembershipSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    billno: {
        type: String,
        required: true
    },
    prevbillnos: [{
        type: String,
        required: false,
        default: null
    }]
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model('MembershipList', MembershipSchema)