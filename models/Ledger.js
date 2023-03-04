const mongoose = require('mongoose')

const LedgerSchema = new mongoose.Schema({
    billno: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true
    },
    ordertype: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    paymenttype: {
        type: String,
        required: true
    },
    membership: {
        type: String,
        required: false
    },
    qty: {
        type: Number,
        required: true
    },
    totalprice: {
        type: Number,
        required: false
    },
    hsncode: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model('LedgerList', LedgerSchema)