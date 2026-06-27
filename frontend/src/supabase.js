// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://cvgxzwnsdjixqehruqvc.supabase.co'
// const supabaseAnonKey = 'sb_publishable_bYkKW2xBY5bsqZ_GyetliQ_cAIRCc5W'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvgxzwnsdjixqehruqvc.supabase.co";
const supabaseAnonKey =
  "sb_publishable_bYkKW2xBY5bsqZ_GyetliQ_cAIRCc5W";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

