const { supabase } = require('../supabase')

const getAll = async () => {
    const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('id', { ascending: true })
    if (error) throw error
    return data
}

module.exports = { getAll }
