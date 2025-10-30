import axios from 'axios'

const SUPABASE_URL = 'https://lckghapuxijhsfydfzmy.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja2doYXB1eGlqaHNmeWRmem15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY0MzAsImV4cCI6MjA3NjM3MjQzMH0.yjW7FEGKDuhpPI-AMuOcj-1UJRP7AbMNvLyAbE1Q5RA'

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  },
})

export default api
