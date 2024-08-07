import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types";
// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
