<!-- # 🔗 Connect Supabase to Your Published Site

## 🚨 **Current Issue**
Your site is published at https://3d-tile-showroom-vis-4j8b.bolt.host but Supabase is not connected because:
- No Supabase project has been created yet
- Environment variables are not configured
- Database tables don't exist

## 🚀 **Step-by-Step Solution**

### **Step 1: Create Supabase Project (5 minutes)**
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a **free account**
3. Click **"New Project"**
4. Fill in details:
   - **Name**: `tile-showroom-3d`
   - **Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. **Wait 2-3 minutes** for setup

### **Step 2: Set Up Database (5 minutes)**
1. In your Supabase project, go to **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste content from these files (in order):
   - First: `supabase/migrations/20250914103042_still_darkness.sql`
   - Second: `supabase/migrations/20250914105643_curly_dust.sql`
   - Third: `supabase/migrations/20250914161236_dry_reef.sql`
4. Click **"Run"** for each migration
5. Verify tables are created in **"Table Editor"**

### **Step 3: Get Your Credentials**
1. Go to **"Settings"** → **"API"**
2. Copy these two values:
   ```
   Project URL: https://your-project-id.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Step 4: Configure Environment Variables**
Create a `.env` file in your project root with your credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### **Step 5: Redeploy Your Site**
After updating the `.env` file, the site needs to be redeployed to include your Supabase credentials.

## ✅ **What You'll Get After Setup**
- ✅ User authentication (sign up/sign in)
- ✅ Tile management for sellers
- ✅ Favorites system for customers
- ✅ Analytics tracking
- ✅ QR code generation
- ✅ 3D tile visualization

## 🧪 **Testing Your Connection**
1. Visit your published site
2. Try to sign up with a test email
3. Check if user appears in Supabase **"Authentication"** → **"Users"**
4. Add some tiles as a seller
5. Test the favorites system

## 🚨 **Important Notes**
- Supabase is **completely free** for development
- Your database will be hosted in the cloud
- All data is secure with Row Level Security
- Real-time updates work automatically

## 🆘 **Need Help?**
If you encounter issues:
1. Check that all migration files ran successfully
2. Verify credentials are copied exactly
3. Ensure no typos in environment variables
4. Test connection in Supabase dashboard first

Once you complete these steps, your published site will be fully functional with database connectivity! -->