// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mfxulcnrcznhiyphvabm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meHVsY25yY3puaGl5cGh2YWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDg0NzgsImV4cCI6MjA1OTQyNDQ3OH0.cxJuhYrAs61_P8KRKmMkgQ5dRvCBvxRA1C2MREvKAUo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);