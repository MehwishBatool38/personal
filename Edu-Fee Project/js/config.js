// ============================================================
// EduFee — Supabase Configuration
// Replace the values below with your actual Supabase project credentials
// Found in: Supabase Dashboard → Settings → API
// ============================================================

const SUPABASE_CONFIG = {
    // 1. Log in to Supabase Dashboard (supabase.com)
    // 2. Go to Settings -> API
    // 3. Copy 'Project URL' and 'anon public' key here
    url: 'https://qtxteutyehhzfyqvaxks.supabase.co', // ⬅ Replace with your Project URL
    anonKey: 'sb_publishable_LxGwh6D9wZI9bUKDoVFxuw_qGSmyMft', // ⬅ Replace with your Anon Public Key
};

// MASTER ADMIN CONFIGURATION
const MASTER_ADMIN_EMAIL = 'admin@edufee.com'; // ⬅ Change this to YOUR email address

// DO NOT commit real credentials to version control.
// For production, use environment variables or a .env file.