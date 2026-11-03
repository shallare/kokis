import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubkizffllckavnsknqgp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia2l6ZmZsbGNrYXZuc2tucWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQwMDIsImV4cCI6MjA5MDYzMDAwMn0.PA9WjQDE6RHWKDEmz-0S0LsaOac2o1MgrMTIU7a4s_E';

export const supabase = createClient(supabaseUrl, supabaseKey);
