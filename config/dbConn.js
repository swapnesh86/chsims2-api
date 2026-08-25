const mongoose = require('mongoose')
const { logEvents } = require('../middleware/logger')

const RETRY_DELAY_MS = 5000

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.DATABASE_URI, {
            serverSelectionTimeoutMS: 5000
        })
    } catch (err) {
        logEvents(`${err.name}: ${err.message}`, 'mongoErrLog.log')
        console.log(`MongoDB connection failed, retrying in ${RETRY_DELAY_MS / 1000}s`)
        setTimeout(connectDB, RETRY_DELAY_MS)
    }
}

// mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const isDbReady = () => mongoose.connection.readyState === 1

const requireDbReady = (req, res, next) => {
    if (isDbReady()) return next()
    res.status(503).json({ message: 'Service temporarily unavailable - database not connected' })
}

module.exports = { connectDB, isDbReady, requireDbReady }