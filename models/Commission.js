const mongoose = require('mongoose')

const CommissionSchema = new mongoose.Schema({
    adlow: {
        type: Number,
        required: true,
        default: 7000
    },
    admid: {
        type: Number,
        required: true,
        default: 13000
    },
    adhigh: {
        type: Number,
        required: true,
        default: 25000
    },
    balow: {
        type: Number,
        required: true,
        default: 7000
    },
    bamid: {
        type: Number,
        required: true,
        default: 13000
    },
    bahigh: {
        type: Number,
        required: true,
        default: 25000
    },
    polow: {
        type: Number,
        required: true,
        default: 7000
    },
    pomid: {
        type: Number,
        required: true,
        default: 13000
    },
    pohigh: {
        type: Number,
        required: true,
        default: 25000
    },
    exlow: {
        type: Number,
        required: true,
        default: 15000
    },
    exmid: {
        type: Number,
        required: true,
        default: 25000
    },
    exhigh: {
        type: Number,
        required: true,
        default: 45000
    }
}
)


module.exports = mongoose.model('CommissionList', CommissionSchema)