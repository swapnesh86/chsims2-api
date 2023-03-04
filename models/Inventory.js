const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    barcode: {
        type: String,
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


module.exports = mongoose.model('InventoryList', InventorySchema)