const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,     // limit to 5 login requests per window per minute
    message: { message: 'Too many log in attempts, Please try again after 60 seconds' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLof.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,  // Recommended in documentation in middleware documentation
    legacyHeaders: false  // Recommended in documentation in middleware documentation
})

module.exports = loginLimiter