<!-- # 🚀 Step-by-Step: Create Your Database Right Now

## 📋 **Follow These Exact Steps**

### **Step 1: Create Supabase Account (2 minutes)**
1. Open your browser and go to: **[supabase.com](https://supabase.com)**
2. Click the **"Start your project"** button
3. Sign up using:
   - GitHub account (recommended)
   - Google account
   - Or email/password
4. Verify your email if required

### **Step 2: Create New Project (3 minutes)**
1. After signing in, click **"New Project"**
2. Fill in the details:
   - **Organization**: Use default or create new
   - **Project Name**: `tile-showroom-3d`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
3. Click **"Create new project"**
4. **Wait 2-3 minutes** for the project to be created

### **Step 3: Set Up Database Tables (5 minutes)**
1. Once your project is ready, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. **Copy the entire content** from `supabase/migrations/20250914103042_still_darkness.sql`
4. **Paste it** in the SQL editor
5. Click **"Run"** button
6. **Repeat** for the other two migration files:
   - `supabase/migrations/20250914105643_curly_dust.sql`
   - `supabase/migrations/20250914161236_dry_reef.sql`

### **Step 4: Get Your Credentials (1 minute)**
1. Click **"Settings"** in the left sidebar
2. Click **"API"** under Settings
3. You'll see two important values:
   ```
   Project URL: https://abcdefghijk.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Copy both values** - you'll need them next

### **Step 5: Update Your Applications (2 minutes)**

**For Web App:**
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**For Mobile App:**
Update `mobile-app/src/services/supabase.ts`:
```typescript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

### **Step 6: Test Your Setup (1 minute)**
1. Go to **"Table Editor"** in Supabase
2. You should see these tables:
   - `tiles`
   - `user_profiles`
   - `tile_sellers`
   - `customer_favorites`
   - `tile_analytics`
   - `tile_analytics_summary`

## ✅ **Verification Checklist**

- [ ] Supabase account created
- [ ] Project `tile-showroom-3d` created
- [ ] All 3 migration files executed successfully
- [ ] Tables visible in Table Editor
- [ ] Credentials copied
- [ ] Applications updated with credentials

## 🎉 **You're Done!**

Your database is now created and ready! You can:
- View your data in the Supabase dashboard
- Run your web application
- Build your mobile app
- Add tiles and users

## 🚨 **If You Get Stuck**

Common issues and solutions:
- **"Project creation failed"**: Try a different project name
- **"SQL error"**: Make sure you run migration files in order
- **"Table not found"**: Check if all migrations ran successfully
- **"Connection error"**: Verify your credentials are copied correctly

**Total time needed: About 15 minutes** -->