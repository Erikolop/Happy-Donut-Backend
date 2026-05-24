const express = require('express')
const router = express.Router()
const katalogController = require('../controllers/katalogController')
const upload = require('../middleware/upload')

router.get('/', katalogController.getAll)
router.get('/:id', katalogController.getById)
router.post('/', upload.single('gambar'), katalogController.create)
router.put('/:id', upload.single('gambar'), katalogController.update)
router.delete('/:id', katalogController.remove)

module.exports = router
