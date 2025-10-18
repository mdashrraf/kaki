# 🗄️ Supabase Database Management Setup

## ✅ Current Status
- **Supabase CLI**: Installed and linked
- **Project**: Connected to `dnwzlsgpiztwyrajnnms`
- **Local Development**: Ready

## 🛠️ Safe Database Management Commands

### 1. Create New Migration (Safe)
```bash
# Create a new migration file
supabase migration new add_new_table

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_new_table.sql
```

### 2. Apply Migrations (Safe)
```bash
# Apply pending migrations to remote database
supabase db push

# Apply migrations to local database
supabase db reset --local
```

### 3. Generate Types (Safe)
```bash
# Generate TypeScript types from your database
supabase gen types typescript --local > src/types/database.types.ts
```

### 4. Backup Database (Safe)
```bash
# Create a backup of your database
supabase db dump --data-only > backup_data.sql
supabase db dump --schema-only > backup_schema.sql
```

## 📁 Migration Examples

### Example 1: Add New Column (Safe)
```sql
-- File: supabase/migrations/YYYYMMDDHHMMSS_add_user_preferences.sql
ALTER TABLE users 
ADD COLUMN preferences JSONB DEFAULT '{}';

-- Add index for better performance
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
```

### Example 2: Add New Table (Safe)
```sql
-- File: supabase/migrations/YYYYMMDDHHMMSS_add_user_sessions.sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

### Example 3: Modify Existing Table (Safe)
```sql
-- File: supabase/migrations/YYYYMMDDHHMMSS_add_user_profile_fields.sql
-- Add new columns
ALTER TABLE users 
ADD COLUMN avatar_url VARCHAR(500),
ADD COLUMN bio TEXT,
ADD COLUMN date_of_birth DATE;

-- Add constraints
ALTER TABLE users 
ADD CONSTRAINT check_bio_length CHECK (LENGTH(bio) <= 500);

-- Add indexes
CREATE INDEX idx_users_dob ON users(date_of_birth);
```

## 🚨 NEVER RUN THESE COMMANDS (Destructive)

```bash
# ❌ NEVER - This will delete all data
supabase db reset

# ❌ NEVER - This drops the entire database
DROP DATABASE postgres;

# ❌ NEVER - This removes all tables
DROP SCHEMA public CASCADE;
```

## 🔄 Safe Workflow

### 1. Development Workflow
```bash
# 1. Make changes to your local database
supabase start

# 2. Create migration from changes
supabase db diff --file add_new_feature

# 3. Review the generated migration
cat supabase/migrations/YYYYMMDDHHMMSS_add_new_feature.sql

# 4. Apply to remote database
supabase db push
```

### 2. Testing Workflow
```bash
# 1. Test locally first
supabase start
npm test

# 2. Apply to staging (if you have one)
supabase db push --project-ref your-staging-project

# 3. Apply to production
supabase db push --project-ref dnwzlsgpiztwyrajnnms
```

## 📋 Database Management Scripts

### Create a new migration
```bash
#!/bin/bash
# File: scripts/new-migration.sh
echo "Creating new migration..."
read -p "Migration name: " migration_name
supabase migration new $migration_name
echo "Migration created! Edit the file in supabase/migrations/"
```

### Backup before changes
```bash
#!/bin/bash
# File: scripts/backup.sh
echo "Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
supabase db dump --data-only > "backups/data_$timestamp.sql"
supabase db dump --schema-only > "backups/schema_$timestamp.sql"
echo "Backup created: backups/data_$timestamp.sql"
```

### Apply migrations safely
```bash
#!/bin/bash
# File: scripts/deploy.sh
echo "Applying migrations..."
supabase db push
echo "Generating types..."
supabase gen types typescript --local > src/types/database.types.ts
echo "Deployment complete!"
```

## 🔧 Environment Setup

### Local Development
```bash
# Start local Supabase
supabase start

# This gives you:
# - Local database
# - Local API
# - Local dashboard
# - Local auth
```

### Production Management
```bash
# Link to production
supabase link --project-ref dnwzlsgpiztwyrajnnms

# Apply changes to production
supabase db push
```

## 📊 Monitoring & Maintenance

### Check Migration Status
```bash
# See applied migrations
supabase migration list

# See pending migrations
supabase db diff
```

### Database Health Check
```bash
# Check database size
supabase db dump --schema-only | wc -l

# Check table sizes
psql $DATABASE_URL -c "SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats WHERE schemaname = 'public';"
```

## 🎯 Best Practices

1. **Always test locally first**
2. **Create backups before major changes**
3. **Use descriptive migration names**
4. **Review generated SQL before applying**
5. **Never run destructive commands**
6. **Use transactions for complex changes**
7. **Add indexes for performance**
8. **Enable RLS on new tables**

Your Supabase setup is now ready for safe database management! 🚀
