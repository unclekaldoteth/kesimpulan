import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!; "https://esolvhnpvfoavgycrwgy.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb2x2aG5wdmZvYXZneWNyd2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzI1MDIsImV4cCI6MjA3OTcwODUwMn0.5Ftxio_WD-2dRhBmMVosu_fYFxjXjhimxLMhZtgHSnY"

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
