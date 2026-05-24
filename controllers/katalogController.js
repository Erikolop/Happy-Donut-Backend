const katalogModel = require('../models/katalogModel')

const getAll = async (req, res, next) => {
    try {
        const data = await katalogModel.getAll()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const getById = async (req, res, next) => {
    try {
        const data = await katalogModel.getById(req.params.id)
        if (!data) return res.status(404).json({ error: 'Produk tidak ditemukan' })
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const create = async (req, res, next) => {
    try {
        const { nama_katalog, harga, stok, deskripsi, kategori } = req.body
        let gambar = null

        if (req.file) {
            gambar = await katalogModel.uploadImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            )
        }

        const newItem = await katalogModel.create({
            nama_katalog,
            harga: Number(harga),
            stok: Number(stok),
            deskripsi,
            kategori,
            gambar
        })
        res.status(201).json(newItem)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const { nama_katalog, harga, stok, deskripsi, kategori } = req.body
        const updateData = {
            nama_katalog,
            harga: Number(harga),
            stok: Number(stok),
            deskripsi,
            kategori
        }

        if (req.file) {
            updateData.gambar = await katalogModel.uploadImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            )
        }

        const updated = await katalogModel.update(req.params.id, updateData)
        res.json(updated)
    } catch (err) {
        next(err)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await katalogModel.remove(req.params.id)
        res.json(result)
    } catch (err) {
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }
