const { supabase } = require('../supabase')

const findByUsername = async (username) => {
    const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', username)
        .single()
    if (error) return null
    return data
}

module.exports = { findByUsername }
