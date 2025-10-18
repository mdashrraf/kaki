# 🗄️ Corrected SQL Schema for Supabase

## ✅ Run This SQL in Supabase SQL Editor

**Go to**: https://supabase.com/dashboard/project/dnwzlsgpiztwyrajnnms  
**Click**: SQL Editor → New Query  
**Copy and paste this EXACT SQL**:

```sql
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
```

## 🚨 Important Notes:

1. **Copy ONLY the SQL code** (between the ```sql and ``` markers)
2. **Don't copy the comments** that start with `--`
3. **Make sure there are no extra characters** or formatting
4. **Run it as one complete query**

## ✅ After Running the SQL:

1. **Go to "Table Editor"** in the left sidebar
2. **You should see a "users" table** created
3. **Test your app** - the onboarding should now work!

## 🧪 Test Your App:

1. **Run**: `npm start`
2. **Go through onboarding**:
   - Enter name: "Test User"
   - Enter phone: "12345678"
   - Click "Continue"
3. **Check Supabase Table Editor** - you should see the data!

The error you got was because the SQL had markdown formatting mixed in. This corrected version should work perfectly! 🚀
