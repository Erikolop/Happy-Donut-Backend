const kategoriModel = require('../models/kategoriModel')

const getAll = async (req, res, next) => {
    try {
        const data = await kategoriModel.getAll()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

module.exports = { getAll }
