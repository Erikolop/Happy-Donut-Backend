const express = require('express')
const cors = require('cors')
require('dotenv').config()

const adminRoutes = require('./routes/adminRoutes')
const katalogRoutes = require('./routes/katalogRoutes')
const kategoriRoutes = require('./routes/kategoriRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : []

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin) return callback(null, true)
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/katalog', katalogRoutes)
app.use('/api/kategori', kategoriRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message || 'Something went wrong' })
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

module.exports = app