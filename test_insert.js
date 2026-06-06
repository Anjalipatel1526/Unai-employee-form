import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function runTest() {
  console.log("URL:", process.env.VITE_SUPABASE_URL);
  
  // Try to insert a dummy record
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .insert([{
      employee_code: 'TEST-ONBOARD-' + Math.floor(Math.random() * 100000),
      full_name: 'Test Candidate',
      personal_email: 'test@example.com',
      mobile: '+919999999999',
      current_address: '123 Test St',
      current_city: 'Test City',
      current_state: 'Test State',
      current_country: 'Test Country',
      current_pincode: '123456',
      permanent_address: '123 Test St',
      permanent_city: 'Test City',
      permanent_state: 'Test State',
      permanent_country: 'Test Country',
      permanent_pincode: '123456',
      employee_type: 'employee',
      department: 'Engineering',
      designation: 'Software Engineer',
      date_of_joining: '2026-06-06',
      employment_type: 'full-time',
      highest_qualification: 'B.Tech',
      university: 'Test University',
      year_of_passing: '2024',
      percentage: '80%',
      emergency_name: 'Emergency Contact',
      emergency_relationship: 'Friend',
      emergency_mobile: '+918888888888',
      declaration_accepted: true
    }])
    .select();

  if (error) {
    console.error("Insert failed with error:", error);
  } else {
    console.log("Insert succeeded! Data:", data);
  }
}

runTest();
