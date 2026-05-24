const { supabase, supabaseAdmin } = require('../supabase')
const { v4: uuidv4 } = require('uuid')

const BUCKET = 'gambar_katalog'

// Fetch all katalog rows as plain objects (no FK embed)
const fetchRaw = async (filter = null) => {
    // Use the raw REST endpoint to avoid Supabase JS client FK auto-embedding
    const url = `${process.env.SUPABASE_URL}/rest/v1/katalog?select=id_katalog,nama_katalog,harga,stok,gambar,deskripsi,kategori${filter ? `&${filter}` : ''}&order=id_katalog.asc`
    const res = await fetch(url, {
        headers: {
            'apikey': process.env.SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
            'Accept': 'application/json'
        }
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Gagal memuat katalog')
    }
    return res.json()
}

// Enrich rows with kategori_nama by looking up the kategori table
const enrichWithKategori = async (rows) => {
    const { data: cats, error } = await supabase.from('kategori').select('id, nama')
    const catMap = {}
    if (cats) cats.forEach(c => { catMap[c.id] = c.nama })
    return rows.map(row => ({
        ...row,
        kategori_nama: catMap[row.kategori] || null
    }))
}

const getAll = async () => {
    const rows = await fetchRaw()
    return enrichWithKategori(rows)
}

const getById = async (id) => {
    const rows = await fetchRaw(`id_katalog=eq.${id}`)
    if (!rows || rows.length === 0) return null
    const [enriched] = await enrichWithKategori(rows)
    return enriched
}

const uploadImage = async (buffer, originalName, mimetype) => {
    const ext = originalName.split('.').pop()
    const filename = `${uuidv4()}.${ext}`
    console.log('[uploadImage] Uploading to bucket:', BUCKET, 'filename:', filename)
    const { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filename, buffer, { contentType: mimetype, upsert: false })
    if (error) {
        console.error('[uploadImage] Full error:', JSON.stringify(error, null, 2))
        throw error
    }
    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename)
    console.log('[uploadImage] Public URL:', urlData.publicUrl)
    return urlData.publicUrl
}

const deleteImage = async (publicUrl) => {
    try {
        const url = new URL(publicUrl)
        const parts = url.pathname.split(`/${BUCKET}/`)
        if (parts.length < 2) return
        const filename = parts[1]
        await supabaseAdmin.storage.from(BUCKET).remove([filename])
    } catch (_) {}
}

const create = async (dataObj) => {
    const url = `${process.env.SUPABASE_URL}/rest/v1/katalog`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': process.env.SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(dataObj)
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Gagal membuat produk')
    }
    const rows = await res.json()
    return rows[0]
}

const update = async (id, dataObj) => {
    const url = `${process.env.SUPABASE_URL}/rest/v1/katalog?id_katalog=eq.${id}`
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': process.env.SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(dataObj)
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Gagal memperbarui produk')
    }
    const rows = await res.json()
    return rows[0]
}

const remove = async (id) => {
    // Fetch gambar first for cleanup
    const rows = await fetchRaw(`id_katalog=eq.${id}`)
    if (rows && rows[0] && rows[0].gambar) await deleteImage(rows[0].gambar)

    const url = `${process.env.SUPABASE_URL}/rest/v1/katalog?id_katalog=eq.${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'apikey': process.env.SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`
        }
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Gagal menghapus produk')
    }
    return { message: 'Deleted successfully' }
}

module.exports = { getAll, getById, create, update, remove, uploadImage }
