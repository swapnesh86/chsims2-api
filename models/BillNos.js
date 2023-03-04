const mongoose = require('mongoose')

const BillNoSchema = new mongoose.Schema({
    ad: {
        type: Number,
        required: true,
        default: 0
    },
    ba: {
        type: Number,
        required: true,
        default: 0
    },
    po: {
        type: Number,
        required: true,
        default: 0
    },
    ex: {
        type: Number,
        required: true,
        default: 0
    },
    dn: {
        type: Number,
        required: true,
        default: 0
    },
    db: {
        type: Number,
        required: true,
        default: 0
    },
    os: {
        type: Number,
        required: true,
        default: 0
    },
    int: {
        type: Number,
        required: true,
        default: 0
    },
    ip: {
        type: Number,
        required: true,
        default: 0
    },
    rs: {
        type: Number,
        required: true,
        default: 0
    },
}
)


module.exports = mongoose.model('BillNo', BillNoSchema)