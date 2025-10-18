// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

// Supabase project details
const supabaseUrl = 'https://dnwzlsgpiztwyrajnnms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRud3psc2dwaXp0d3lyYWpubm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTkyODMsImV4cCI6MjA3NjMzNTI4M30._BrzC9zqMjhR-ChpneJ7inxMUkxioVHwXh771s92RJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Schema for Users Table
// Run this SQL in your Supabase SQL Editor:

/*
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) DEFAULT '+65',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for phone number lookups
CREATE INDEX idx_users_phone_number ON users(phone_number);

-- Create index for active users
CREATE INDEX idx_users_active ON users(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for onboarding)
CREATE POLICY "Allow public insert" ON users
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to read their own data
CREATE POLICY "Allow users to read own data" ON users
  FOR SELECT USING (true);

-- Create policy to allow users to update their own data
CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
*/
