const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Initialize Supabase client with secure environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = supabase
