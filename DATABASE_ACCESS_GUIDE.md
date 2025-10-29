<!-- # 🗄️ Complete Database Access Guide

## 📍 **Where Your Database is Stored**

Your database is stored in **Supabase** (PostgreSQL cloud database). Here's how to access it:

### **1. Access Your Database**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `tile-showroom-3d`
4. You'll see your database dashboard

### **2. View Your Data**
- **Table Editor**: See all tables and data visually
- **SQL Editor**: Run custom queries
- **API**: Access via REST/GraphQL
- **Authentication**: View users and sessions

## 🏗️ **Complete Database Schema**

Your database contains these main tables:

### **📋 Tables Overview**
```
├── tiles                    # All tile products
├── tile_analytics          # View/application tracking
├── tile_analytics_summary  # Aggregated analytics
├── user_profiles           # User information & roles
├── tile_sellers           # Business information
├── customer_favorites     # User favorite tiles
└── auth.users            # Supabase authentication
```

## 📊 **Detailed Table Structures**

### **1. `tiles` Table**
```sql
CREATE TABLE tiles (
  id text PRIMARY KEY,
  name text NOT NULL,
  image_url text NOT NULL,
  texture_url text NOT NULL,
  category text CHECK (category IN ('floor', 'wall', 'both')),
  size text NOT NULL,
  price numeric NOT NULL,
  in_stock boolean DEFAULT true,
  showroom_id text NOT NULL,
  seller_id uuid REFERENCES auth.users(id),
  qr_code text,                    -- Base64 QR code image
  qr_code_url text,               -- QR code access URL
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **2. `tile_analytics` Table**
```sql
CREATE TABLE tile_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tile_id text NOT NULL,
  showroom_id text NOT NULL,
  action_type text CHECK (action_type IN ('view', 'apply')),
  surface_type text CHECK (surface_type IN ('floor', 'wall')),
  room_type text CHECK (room_type IN ('hall', 'washroom', 'kitchen')),
  customer_id uuid REFERENCES auth.users(id),
  timestamp timestamptz DEFAULT now(),
  session_id text,
  user_agent text
);
```

### **3. `user_profiles` Table**
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  email text NOT NULL,
  full_name text,
  role text CHECK (role IN ('customer', 'seller', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **4. `tile_sellers` Table**
```sql
CREATE TABLE tile_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  business_name text NOT NULL,
  business_address text,
  phone text,
  website text,
  logo_url text,
  subscription_status text DEFAULT 'active' 
    CHECK (subscription_status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **5. `customer_favorites` Table**
```sql
CREATE TABLE customer_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id),
  tile_id text NOT NULL,
  showroom_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, tile_id)
);
```

### **6. `tile_analytics_summary` Table**
```sql
CREATE TABLE tile_analytics_summary (
  tile_id text PRIMARY KEY,
  tile_name text NOT NULL,
  showroom_id text NOT NULL,
  category text NOT NULL,
  view_count integer DEFAULT 0,
  apply_count integer DEFAULT 0,
  last_viewed timestamptz,
  last_applied timestamptz,
  updated_at timestamptz DEFAULT now()
);
```

## 🔍 **How to Access Your Data**

### **Method 1: Supabase Dashboard (Visual)**
1. Go to your Supabase project
2. Click **"Table Editor"** in sidebar
3. Select any table to view/edit data
4. Add, edit, delete records visually

### **Method 2: SQL Editor (Advanced)**
1. Click **"SQL Editor"** in sidebar
2. Write custom queries:
```sql
-- View all tiles
SELECT * FROM tiles;

-- View user analytics
SELECT * FROM tile_analytics ORDER BY timestamp DESC;

-- View most popular tiles
SELECT tile_name, view_count, apply_count 
FROM tile_analytics_summary 
ORDER BY view_count DESC;
```

### **Method 3: API Access (Programmatic)**
```javascript
// Using Supabase client
const { data, error } = await supabase
  .from('tiles')
  .select('*');
```

## 📱 **Sample Data Queries**

### **View All Tiles**
```sql
SELECT id, name, category, size, price, in_stock 
FROM tiles 
ORDER BY created_at DESC;
```

### **View Analytics Summary**
```sql
SELECT 
  t.name,
  tas.view_count,
  tas.apply_count,
  tas.last_viewed
FROM tile_analytics_summary tas
JOIN tiles t ON t.id = tas.tile_id
ORDER BY tas.view_count DESC;
```

### **View User Activity**
```sql
SELECT 
  up.full_name,
  up.role,
  COUNT(ta.id) as total_actions
FROM user_profiles up
LEFT JOIN tile_analytics ta ON ta.customer_id = up.user_id
GROUP BY up.id, up.full_name, up.role;
```

## 🔐 **Database Security**

Your database uses **Row Level Security (RLS)**:
- **Customers**: Can only see their own favorites
- **Sellers**: Can only manage their own tiles
- **Admin**: Can see everything
- **Public**: Can view tiles but not modify

## 📊 **Data Export Options**

### **Export as CSV**
1. Go to Table Editor
2. Select table
3. Click "Export" → "CSV"

### **Export via SQL**
```sql
COPY tiles TO '/tmp/tiles.csv' DELIMITER ',' CSV HEADER;
```

### **Backup Database**
1. Go to Settings → Database
2. Click "Database backups"
3. Download full backup

## 🔗 **Connection Details**

Your database connection details:
- **Host**: `db.your-project-id.supabase.co`
- **Database**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: Your project password

## 📞 **Need Help?**

To access your specific database:
1. Create Supabase account
2. Set up project with provided migrations
3. Use the credentials in your applications
4. Access via dashboard or API

Your data is stored securely in Supabase's PostgreSQL cloud database with automatic backups and scaling! -->