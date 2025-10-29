<!-- # 🔑 Correct Admin Setup - Fix UUID Error

## 🚨 **The Error Explained**
The error `invalid input syntax for type uuid: "admin"` means you used the word "admin" instead of the actual UUID from the user you created.

## ✅ **Correct Steps:**

### **Step 1: Create Admin User in Supabase**
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Fill in:
   - **Email**: `admin@tileshowroom.com`
   - **Password**: `Admin123!@#`
   - **Email Confirm**: ✅ Check this box
4. Click **"Create user"**

### **Step 2: Copy the ACTUAL User ID**
After creating the user, you'll see a table with the new user. The **ID column** will show something like:
```
12345678-abcd-1234-5678-123456789012
```
**Copy this entire UUID** (not the word "admin")!

### **Step 3: Create Admin Profile with REAL UUID**
1. Go to **SQL Editor**
2. Use this query, but **replace the UUID** with the real one:

```sql
-- Replace the UUID below with the ACTUAL user ID from Step 2
INSERT INTO user_profiles (user_id, email, full_name, role)
VALUES ('12345678-abcd-1234-5678-123456789012', 'admin@tileshowroom.com', 'System Administrator', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  full_name = 'System Administrator',
  updated_at = now();
```

### **Step 4: Verify the Profile**
Check if it worked:
```sql
SELECT * FROM user_profiles WHERE email = 'admin@tileshowroom.com';
```

## 🎯 **Alternative: Automatic Method**
If you want to avoid copying UUIDs, use this query that finds the user automatically:

```sql
-- This finds the admin user automatically and creates the profile
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find the admin user ID
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@tileshowroom.com';
  
  -- Check if user exists
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found. Please create user first in Authentication → Users';
  END IF;
  
  -- Create the profile
  INSERT INTO user_profiles (user_id, email, full_name, role)
  VALUES (admin_user_id, 'admin@tileshowroom.com', 'System Administrator', 'admin')
  ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    full_name = 'System Administrator',
    updated_at = now();
  
  RAISE NOTICE 'Admin profile created successfully for user: %', admin_user_id;
END $$;
```

## 🌐 **Then Access Admin Panel:**
**URL**: https://3d-tile-showroom-vis-4j8b.bolt.host/admin
**Credentials**: `admin@tileshowroom.com` / `Admin123!@#`

The key is using the **actual UUID** from the created user, not the word "admin"! -->