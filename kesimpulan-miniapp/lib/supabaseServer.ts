import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!; "https://esolvhnpvfoavgycrwgy.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb2x2aG5wdmZvYXZneWNyd2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDEzMjUwMiwiZXhwIjoyMDc5NzA4NTAyfQ.w_03lST6letbAI-_X266dXd9hH6H0cWLdjCEf-uCoZs"

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
