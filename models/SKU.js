const mongoose = require('mongoose')

const SKUSchema = new mongoose.Schema({
    Barcode: {
        type: String, 
        required: true
    },
    SKU: {
        type: String, 
        required: false
    },
    Name: {
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
    }
    
})

module.exports = mongoose.model('SKUList', SKUSchema)