import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://brfkzcmtohregfauqpji.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZmt6Y210b2hyZWdmYXVxcGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTcxNDYsImV4cCI6MjA2MDg5MzE0Nn0.pgRLzFF61khkks75cH5WY3rvZEUw4rUTvgW7PJmbPmM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
