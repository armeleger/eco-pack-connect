import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mqzoutvuzzftpyorrqfn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xem91dHZ1enpmdHB5b3JycWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDg5MjUsImV4cCI6MjA5MDAyNDkyNX0.bq6bBWbJ9si24-fUTR0vMNcj5D6Ln1QMTZfeA_P8e6E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);