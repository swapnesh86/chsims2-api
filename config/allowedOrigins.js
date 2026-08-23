const allowedOrigins = [
    'https://chsims2.onrender.com',
    'https://chsims.web.app'
]

// Set in .env (gitignored) for local dev only - never set on Render/Cloud Run.
if (process.env.LOCAL_ORIGIN) {
    allowedOrigins.push(process.env.LOCAL_ORIGIN)
}

module.exports = allowedOrigins