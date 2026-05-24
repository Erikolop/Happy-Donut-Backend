const adminModel = require('../models/adminModel')

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: 'Username dan password wajib diisi' })
        }

        const admin = await adminModel.findByUsername(username)
        if (!admin) {
            return res.status(401).json({ error: 'Username atau password salah' })
        }

        // Plain-text comparison (no hashing as per existing schema)
        if (admin.password !== password) {
            return res.status(401).json({ error: 'Username atau password salah' })
        }

        res.json({
            success: true,
            admin: { id_admin: admin.id_admin, username: admin.username }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { login }
