const express = require('express')
const cors = require('cors')
require('dotenv').config()

const adminRoutes = require('./routes/adminRoutes')
const katalogRoutes = require('./routes/katalogRoutes')
const kategoriRoutes = require('./routes/kategoriRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})