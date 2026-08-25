require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const compression = require('compression')
const corsOptions = require('./config/corsOptions')
const { connectDB, requireDbReady } = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

const bodyParser = require('body-parser')

//console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))     // Use 'allowedOrigins' to restrict what requests are valid

app.use(compression())

app.use(express.json())

app.use(cookieParser())

// This is specifying where it should look for resources
app.use('/', express.static(path.join(__dirname, 'public')))

//To handle the '/' route
app.use('/', require('./routes/root'))

// Everything past this point touches the DB - fail fast instead of hanging
// on Mongoose's query buffering while a connection is still being (re)established.
app.use(requireDbReady)

app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/ledger', require('./routes/ledgerRoutes'))

app.use('/skuinv', require('./routes/skuinvRoutes'))

app.use('/membership', require('./routes/membershipRoutes'))
app.use('/billnos', require('./routes/billNoRoutes'))
app.use('/sendemail', require('./routes/emailRoutes'))
app.use('/attendance', require('./routes/attendanceRoutes'))
app.use('/commission', require('./routes/commissionRoutes'))


// To handle all routes that have not yet been handled
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Database')
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.name}: ${err.message}`, 'mongoErrLog.log')
})
