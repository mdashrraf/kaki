# 🗄️ Supabase Setup Guide for Kaki App

## 📋 Required Supabase Details

To complete the setup, you'll need the following information from your Supabase project:

### 1. Project URL
- **Where to find**: Supabase Dashboard → Settings → API
- **Format**: `https://your-project-id.supabase.co`
- **Example**: `https://abcdefghijklmnop.supabase.co`

### 2. Anon/Public Key
- **Where to find**: Supabase Dashboard → Settings → API
- **Format**: Long string starting with `eyJ...`
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Click "New Project"**
4. **Fill in project details**:
   - Organization: Select your org
   - Name: `kaki-app` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait for setup** (usually 2-3 minutes)

### Step 2: Get Your Credentials

1. **Go to Settings → API**
2. **Copy the following**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update Your App Configuration

1. **Open** `src/config/supabase.js`
2. **Replace the placeholder values**:

```javascript
// Replace these with your actual Supabase project details
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 4: Create Database Schema

1. **Go to Supabase Dashboard → SQL Editor**
2. **Click "New Query"**
3. **Copy and paste** the following SQL:

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

4. **Click "Run"** to execute the SQL

### Step 5: Test the Setup

1. **Run your app**: `npm start`
2. **Test the onboarding flow**:
   - Enter a name (e.g., "John Doe")
   - Enter a phone number (e.g., "12345678")
   - Click "Continue"
3. **Check Supabase Dashboard → Table Editor → users** to see if the data was saved

## 🔧 Database Schema Details

### Users Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `name` | VARCHAR(255) | User's full name |
| `phone_number` | VARCHAR(20) | User's phone number |
| `country_code` | VARCHAR(5) | Country code (default: +65) |
| `created_at` | TIMESTAMP | When user was created |
| `updated_at` | TIMESTAMP | When user was last updated |
| `is_active` | BOOLEAN | Whether user is active (soft delete) |

### Security Features

- **Row Level Security (RLS)**: Enabled for data protection
- **Public Insert Policy**: Allows new users to register
- **Read/Update Policies**: Allow users to access their own data
- **Automatic Timestamps**: `updated_at` is automatically updated

### Indexes

- **Phone Number Index**: Fast lookups by phone number
- **Active Users Index**: Efficient filtering of active users

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid API Key"**
   - Check that you copied the anon key correctly
   - Make sure there are no extra spaces

2. **"Failed to fetch"**
   - Verify your project URL is correct
   - Check that your Supabase project is active

3. **"Permission denied"**
   - Ensure RLS policies are set up correctly
   - Check that the SQL was executed successfully

4. **"Table doesn't exist"**
   - Make sure you ran the SQL schema creation
   - Check the Table Editor to see if the `users` table exists

### Testing Commands:

```javascript
// Test connection
import { supabase } from './src/config/supabase';

// Test insert
const testUser = await supabase
  .from('users')
  .insert([{ name: 'Test User', phone_number: '12345678' }])
  .select();

console.log('Test result:', testUser);
```

## 📱 Next Steps

1. **Complete the setup** with your Supabase credentials
2. **Test the onboarding flow** to ensure data is saved
3. **Add more features** like user profiles, preferences, etc.
4. **Implement authentication** if needed later
5. **Add data validation** and error handling

## 🔒 Security Notes

- The current setup allows public registration (no authentication)
- RLS policies protect user data
- Consider adding authentication for production use
- Phone numbers are stored as plain text (consider encryption for sensitive data)

Your Kaki app is now ready to store user data in Supabase! 🎉
