const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Public client for normal DB queries
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
)

// Service role client for storage uploads (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)


module.exports = { supabase, supabaseAdmin }