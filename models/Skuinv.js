const mongoose = require('mongoose')

const SkuinvSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    MBR: {
        type: Number,
        required: true
    },
    HSNCode: {
        type: Number,
        required: true
    },
    source: {
        type: Number,
        required: false,
        default: 0
    },
    cwefstore: {
        type: Number,
        required: false,
        default: 0
    },
    andheri: {
        type: Number,
        required: false,
        default: 0
    },
    bandra: {
        type: Number,
        required: false,
        default: 0
    },
    powai: {
        type: Number,
        required: false,
        default: 0
    },
    exhibition: {
        type: Number,
        required: false,
        default: 0
    },
    sales: {
        type: Number,
        required: false,
        default: 0
    }
}
)


module.exports = mongoose.model('SkuinvList', SkuinvSchema)