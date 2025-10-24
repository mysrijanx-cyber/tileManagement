
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  User,EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword ,
  sendPasswordResetEmail,
  
} from 'firebase/auth';
import { 
  initializeApp,
  deleteApp,
  FirebaseApp 

} from 'firebase/app';
import 'firebase/firestore';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection, 
  query, 
  where,
  getDocs,
  addDoc,
  orderBy,
  limit, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, TileSeller } from '../types';

// ═══════════════════════════════════════════════════════════════
// ✅ CONFIGURATION & DEBUG
// ═══════════════════════════════════════════════════════════════
/**
 * Change seller password
 * @param email - Seller's email address
 * @param currentPassword - Current password (admin provided)
 * @param newPassword - New password chosen by seller
 */
/**
 * Create worker account for a seller (PRODUCTION-READY v2.0)
 * @param sellerEmail - Seller's email (for verification)
 * @param workerEmail - Worker's email
 * @returns Worker details with generated password
 */

export const isFirebaseConfigured = (): boolean => {
  const configured = 
    !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your-api-key' &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN !== 'your-project.firebaseapp.com';

  if (!configured) {
    console.error('❌ Firebase not properly configured. Check environment variables.');
  }
  return configured;
};

export const debugFirebaseConnection = async (): Promise<boolean> => {
  console.log('🔧 === FIREBASE DEBUG START ===');

  try {
    console.log('Environment:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      mode: import.meta.env.MODE
    });

    if (!isFirebaseConfigured()) {
      console.error('❌ Firebase not configured');
      return false;
    }

    const user = auth.currentUser;
    console.log('Current user:', user?.uid || 'No user');

    console.log('✅ Firebase connection test completed');
    return true;
  } catch (error) {
    console.error('❌ Firebase debug failed:', error);
    return false;
  } finally {
    console.log('🔧 === FIREBASE DEBUG END ===');
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const generateSecurePassword = (): string => {
  const length = 12;
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = "";
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length < 8) {
    return { isValid: true, message: 'Password is acceptable but consider using 8+ characters' };
  }
  return { isValid: true, message: 'Password meets security requirements' };
};

// ═══════════════════════════════════════════════════════════════
// ✅ AUTHENTICATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const waitForAuthUser = (timeoutMs: number = 5000): Promise<User | null> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(user);
    });
  });
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured()) {
    console.log('❌ Firebase not configured in getCurrentUser');
    return null;
  }

  try {
    console.log('🔍 Getting current user profile...');

    const user = auth.currentUser;
    console.log('🔍 Auth user result:', { 
      hasUser: !!user, 
      userId: user?.uid, 
      email: user?.email,
      emailVerified: user?.emailVerified
    });

    if (!user) {
      console.log('ℹ️ No authenticated user found');
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    console.log('🔍 Profile query result:', { 
      hasProfile: userDoc.exists()
    });

    if (!userDoc.exists()) {
      console.warn('⚠️ User profile not found for user:', user.uid);
      return null;
    }

    const profileData = userDoc.data();
    console.log('🔍 Raw profile data:', profileData);

    if (!profileData?.role) {
      console.warn('⚠️ Invalid user profile data - missing role:', profileData);
      return null;
    }

    const profile: UserProfile = {
      id: profileData.id || user.uid,
      user_id: profileData.user_id || user.uid,
      email: profileData.email || user.email || '',
      full_name: profileData.full_name || user.displayName || 'User',
      role: profileData.role,
      account_status: profileData.account_status || 'active',
      created_at: profileData.created_at || new Date().toISOString(),
      updated_at: profileData.updated_at || new Date().toISOString(),
      last_login: profileData.last_login || new Date().toISOString(),
      email_verified: profileData.email_verified ?? user.emailVerified,
      onboarding_completed: profileData.onboarding_completed ?? false,
      created_by: profileData.created_by,
      permissions: profileData.permissions || []
    };

    if (!profile.email) {
      console.warn('⚠️ No email available for user profile');
      return null;
    }
    
    console.log('✅ User profile loaded successfully:', {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      accountStatus: profile.account_status
    });

    return profile;
  } catch (error: any) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    console.log('🔄 Starting admin verification...');
    
    const authUser = await waitForAuthUser(5000);
    
    if (!authUser) {
      console.log('❌ No authenticated user found');
      return false;
    }

    console.log('👤 Auth user verified:', { 
      uid: authUser.uid, 
      email: authUser.email
    });

    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
    
    if (!userDoc.exists()) {
      console.log('❌ User profile not found in database');
      
      if (import.meta.env.MODE === 'development') {
        console.log('🛠️ Development mode: Creating admin profile');
        await createAdminUser();
        return true;
      }
      
      return false;
    }

    const userData = userDoc.data();
    const userRole = userData?.role?.toString().trim().toLowerCase();
    const accountStatus = userData?.account_status?.toString().trim().toLowerCase();
    
    const isAdmin = userRole === 'admin';
    const isActive = accountStatus === 'active' || !accountStatus;
    
    console.log('🔑 Admin verification result:', { 
      uid: authUser.uid,
      role: userRole,
      accountStatus: accountStatus,
      isAdmin: isAdmin,
      isActive: isActive,
      finalResult: isAdmin && isActive
    });
    
    return isAdmin && isActive;
    
  } catch (error) {
    console.error('❌ Error in admin verification:', error);
    return false;
  }
};

export const createAdminUser = async (): Promise<void> => {
  const authUser = auth.currentUser;
  
  if (!authUser) {
    throw new Error('Please login first to create admin profile');
  }
  
  try {
    console.log('🔄 Creating admin profile for user:', authUser.uid);
    
    const adminProfile: Partial<UserProfile> = {
      id: authUser.uid,
      user_id: authUser.uid,
      email: authUser.email || '',
      full_name: authUser.displayName || authUser.email?.split('@')[0] || 'Admin User',
      role: 'admin',
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: authUser.emailVerified,
      onboarding_completed: true,
      permissions: ['manage_sellers', 'view_analytics', 'system_admin'],
      created_by: 'system'
    };
    
    await setDoc(doc(db, 'users', authUser.uid), adminProfile, { merge: true });
    
    await addDoc(collection(db, 'adminLogs'), {
      action: 'admin_profile_created',
      admin_id: authUser.uid,
      admin_email: authUser.email,
      timestamp: new Date().toISOString(),
      created_by: 'system'
    });
    
    console.log('✅ Admin profile created successfully');
  } catch (error) {
    console.error('❌ Error creating admin profile:', error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ SIGN UP FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const signUpCustomer = async (email: string, password: string, fullName: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  try {
    console.log('🔄 Starting customer signup...', { email, fullName });

    if (!validateEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters long');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    const userProfile: Partial<UserProfile> = {
      id: userCredential.user.uid,
      user_id: userCredential.user.uid,
      email: email.trim(),
      full_name: fullName.trim(),
      role: 'customer',
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: userCredential.user.emailVerified,
      onboarding_completed: false,
      permissions: []
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

    console.log('✅ Customer signup completed successfully');
    return { user: userCredential.user, session: null };
  } catch (error: any) {
    console.error('❌ Error signing up customer:', error);
    
    let errorMessage = 'Registration failed: ';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use a stronger password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      default:
        errorMessage += error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const signUpSeller = async (
  email: string,
  password: string,
  fullName: string,
  role: 'seller' | 'admin' = 'seller'
): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  const currentAdmin = auth.currentUser;
  
  if (!currentAdmin) {
    throw new Error('No authenticated admin found. Please login first.');
  }

  try {
    console.log('🔄 Starting seller account creation...');
    console.log('👤 Current admin:', currentAdmin.email);

    console.log('🔐 Verifying administrator privileges...');
    const adminDoc = await getDoc(doc(db, 'users', currentAdmin.uid));
    
    if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
      throw new Error(`Access Denied: Only administrators can create seller accounts.`);
    }

    console.log('✅ Administrator privileges verified');

    if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
      throw new Error('All required fields (email, password, fullName) must be provided.');
    }

    if (!validateEmail(email.trim())) {
      throw new Error('Please provide a valid email format.');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    if (fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters long.');
    }

    console.log(`🔄 Creating Firebase Auth account for: ${email.trim()}`);

    const secondaryApp = initializeApp(
      {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      },
      `secondary-${Date.now()}`
    );

    const secondaryAuth = getAuth(secondaryApp);
    let newUserCredential;

    try {
      newUserCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email.trim(), 
        password
      );
      
      console.log(`✅ Firebase Auth account created: ${newUserCredential.user.uid}`);
      
    } catch (authError: any) {
      console.error('❌ Firebase Auth error:', authError);
      
      await deleteApp(secondaryApp);
      
      switch (authError.code) {
        case 'auth/email-already-in-use':
          return {
            user: { email: email.trim(), uid: null },
            accountCreated: false,
            existingEmail: true,
            error: 'Email address is already registered in the system'
          };
        case 'auth/weak-password':
          throw new Error('Password is too weak. Please use a stronger password.');
        case 'auth/invalid-email':
          throw new Error('Invalid email format provided.');
        default:
          throw new Error(`Account creation failed: ${authError.message}`);
      }
    }

    const userId = newUserCredential.user.uid;

    await firebaseSignOut(secondaryAuth);
    await deleteApp(secondaryApp);
    
    console.log('✅ Secondary auth cleaned up - admin session preserved');

    if (auth.currentUser?.uid !== currentAdmin.uid) {
      console.error('❌ Admin session lost!');
      throw new Error('Admin session was lost during seller creation');
    }

    console.log('✅ Admin session verified - still logged in as:', auth.currentUser.email);

    const userProfile: Partial<UserProfile> = {
      id: userId,
      user_id: userId,
      email: email.trim(),
      full_name: fullName.trim(),
      role: role,
      account_status: 'active',
      email_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: currentAdmin.uid,
      onboarding_completed: false,
      last_login: new Date().toISOString(),
      permissions: role === 'admin' 
        ? ['manage_sellers', 'view_analytics', 'system_admin'] 
        : ['manage_tiles', 'view_own_analytics']
    };

    try {
      await setDoc(doc(db, 'users', userId), userProfile);
      console.log(`✅ User profile created successfully`);
    } catch (dbError: any) {
      console.error('❌ Database error while creating user profile:', dbError);
      
      try {
        await addDoc(collection(db, 'orphanedAccounts'), {
          userId: userId,
          email: email.trim(),
          createdAt: new Date().toISOString(),
          reason: 'profile_creation_failed',
          error: dbError.message
        });
      } catch (logError) {
        console.warn('⚠️ Could not log orphaned account:', logError);
      }
      
      throw new Error(`User profile creation failed: ${dbError.message}. Account flagged for cleanup.`);
    }

    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'seller_account_created',
        admin_id: currentAdmin.uid,
        admin_email: currentAdmin.email,
        seller_id: userId,
        seller_email: email.trim(),
        seller_name: fullName.trim(),
        seller_role: role,
        timestamp: new Date().toISOString(),
        success: true
      });
      console.log('📝 Admin activity logged successfully');
    } catch (logError) {
      console.warn('⚠️ Failed to log admin activity:', logError);
    }

    console.log('🎉 Seller account creation completed successfully');

    return {
      user: newUserCredential.user,
      userId: userId,
      accountCreated: true,
      existingEmail: false,
      profile: userProfile,
      success: true
    };

  } catch (error: any) {
    console.error('❌ Seller signup process failed:', error);

    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'seller_account_creation_failed',
        admin_id: currentAdmin?.uid,
        admin_email: currentAdmin?.email,
        attempted_email: email?.trim(),
        attempted_name: fullName?.trim(),
        error_message: error.message,
        error_code: error.code || 'unknown',
        timestamp: new Date().toISOString(),
        success: false
      });
    } catch (logError) {
      console.warn('⚠️ Failed to log error:', logError);
    }

    if (error.message.includes('Access Denied')) {
      throw error;
    } else {
      throw new Error(`Seller account creation failed: ${error.message}`);
    }
  }
};

export const signIn = async (email: string, password: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please check environment variables.');
  }

  try {
    console.log('🔄 Attempting sign in for:', email.trim());

    if (!validateEmail(email)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!password.trim()) {
      throw new Error('Password is required.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

    if (!userCredential?.user) {
      throw new Error('Authentication failed - no user data returned.');
    }

    // ✅ CHECK ACCOUNT STATUS ON LOGIN
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      if (userData.account_status === 'deleted') {
        await firebaseSignOut(auth);
        throw new Error('Your account has been deactivated. Please contact support.');
      }
      
      if (userData.account_status === 'suspended') {
        await firebaseSignOut(auth);
        throw new Error('Your account has been suspended. Please contact support.');
      }
    }

    try {
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (updateError) {
      console.warn('⚠️ Could not update last login:', updateError);
    }

    console.log('✅ Sign in successful for user:', userCredential.user.uid);
    return { user: userCredential.user, session: null };
    
  } catch (error: any) {
    console.error('❌ Sign in error:', error);
    
    let errorMessage = 'Authentication failed: ';
    
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed login attempts. Please wait a few minutes and try again.';
        break;
      default:
        errorMessage += error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const signOut = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.log('⚠️ Firebase not configured, performing local cleanup only');
  }

  try {
    console.log('🔄 Starting sign out process...');
    const currentUser = auth.currentUser;
    
    if (currentUser && isFirebaseConfigured()) {
      try {
        await addDoc(collection(db, 'authLogs'), {
          action: 'user_signed_out',
          user_id: currentUser.uid,
          email: currentUser.email,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('⚠️ Could not log sign out:', logError);
      }
    }
    
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
        console.log('✅ Firebase sign out successful');
      } catch (firebaseError) {
        console.error('❌ Firebase sign out error:', firebaseError);
      }
    }
    
    console.log('🧹 Clearing authentication storage...');
    
    localStorage.removeItem('tile_access_token');
    localStorage.removeItem('tile_refresh_token');
    localStorage.removeItem('auth_sync_token');
    localStorage.removeItem('tile_user_data');
    localStorage.removeItem('firebase_auth_token');
    
    sessionStorage.clear();
    
    console.log('✅ All authentication data cleared');
    
  } catch (error) {
    console.error('❌ Error during sign out:', error);
    
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ Forced storage cleanup completed');
    } catch (clearError) {
      console.error('❌ Critical: Could not clear storage:', clearError);
    }
    
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ ADMIN DASHBOARD FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getAdminDashboardStats = async (): Promise<any> => {
  try {
    console.log('📊 Fetching admin dashboard statistics...');
    
    const [sellersSnapshot, requestsSnapshot] = await Promise.all([
      getDocs(collection(db, 'sellers')),
      getDocs(collection(db, 'sellerRequests'))
    ]);
    
    const sellers = sellersSnapshot.docs.map(doc => doc.data());
    const requests = requestsSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      totalSellers: sellers.length,
      activeSellers: sellers.filter(s => s.account_status === 'active' || s.subscription_status === 'active').length,
      inactiveSellers: sellers.filter(s => s.account_status === 'inactive' || s.subscription_status === 'inactive').length,
      deletedSellers: sellers.filter(s => s.account_status === 'deleted').length,
      suspendedSellers: sellers.filter(s => s.account_status === 'suspended').length,
      
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
      rejectedRequests: requests.filter(r => r.status === 'rejected').length,
      
      totalRequests: requests.length,
      
      thisMonthSellers: sellers.filter(s => {
        const createdDate = new Date(s.created_at);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear();
      }).length
    };
    
    console.log('✅ Dashboard stats calculated:', stats);
    return stats;
    
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    return {
      totalSellers: 0,
      activeSellers: 0,
      inactiveSellers: 0,
      deletedSellers: 0,
      suspendedSellers: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      totalRequests: 0,
      thisMonthSellers: 0
    };
  }
};

export const getSellersWithFullData = async (): Promise<any[]> => {
  try {
    console.log('🔄 Fetching sellers with complete data...');
    
    const [sellersSnapshot, requestsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, 'sellers')),
      getDocs(collection(db, 'sellerRequests')),
      getDocs(collection(db, 'users'))
    ]);
    
    const sellers: any[] = [];
    sellersSnapshot.forEach(doc => {
      sellers.push({ id: doc.id, ...doc.data() });
    });
    
    const requests: any[] = [];
    requestsSnapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    const users: any[] = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('📊 Fetched:', { sellers: sellers.length, requests: requests.length, users: users.length });
    
    const mergedData: any[] = [];
    
    for (const seller of sellers) {
      if (!seller || !seller.id) {
        console.warn('⚠️ Skipping invalid seller');
        continue;
      }
      
      let matchingRequest: any = null;
      
      for (const r of requests) {
        if (!r) continue;
        
        if (r.email && seller.email) {
          const rEmail = String(r.email).toLowerCase().trim();
          const sEmail = String(seller.email).toLowerCase().trim();
          if (rEmail === sEmail) {
            matchingRequest = r;
            break;
          }
        }
        
        if (r.id && seller.request_id && r.id === seller.request_id) {
          matchingRequest = r;
          break;
        }
        
        if (r.seller_id && seller.id && r.seller_id === seller.id) {
          matchingRequest = r;
          break;
        }
      }
      
      let matchingUser: any = null;
      
      for (const u of users) {
        if (!u) continue;
        
        if (u.id && seller.user_id && u.id === seller.user_id) {
          matchingUser = u;
          break;
        }
        
        if (u.email && seller.email) {
          const uEmail = String(u.email).toLowerCase().trim();
          const sEmail = String(seller.email).toLowerCase().trim();
          if (uEmail === sEmail) {
            matchingUser = u;
            break;
          }
        }
      }
      
      const mergedSeller: any = {
        id: seller.id || '',
        user_id: seller.user_id || seller.userId || null,
        businessName: seller.business_name || seller.businessName || 'Unknown',
        ownerName: seller.owner_name || seller.ownerName || 'Unknown',
        email: seller.email || '',
        phone: seller.phone || seller.phoneNumber || '',
        businessAddress: seller.business_address || seller.businessAddress || '',
        requestedDate: '',
        approvalDate: null,
        rejectedDate: null,
        requestStatus: 'approved',
        accountStatus: 'active',
        subscriptionStatus: 'active',
        createdAt: '',
        updatedAt: '',
        lastLogin: null,
        deleted: false,
        deletedAt: null,
        deletedBy: null,
        deletionReason: null,
        passwordResetSent: null,
        passwordResetBy: null,
        isActive: true,
        daysSinceRequest: 0
      };
      
      if (matchingRequest && matchingRequest.requestedAt) {
        mergedSeller.requestedDate = matchingRequest.requestedAt;
      } else if (matchingRequest && matchingRequest.requested_date) {
        mergedSeller.requestedDate = matchingRequest.requested_date;
      } else if (seller.created_at) {
        mergedSeller.requestedDate = seller.created_at;
      } else {
        mergedSeller.requestedDate = new Date().toISOString();
      }
      
      if (matchingRequest && matchingRequest.reviewedAt) {
        mergedSeller.approvalDate = matchingRequest.reviewedAt;
      } else if (matchingRequest && matchingRequest.approval_date) {
        mergedSeller.approvalDate = matchingRequest.approval_date;
      }
      
      if (matchingRequest && matchingRequest.rejectedAt) {
        mergedSeller.rejectedDate = matchingRequest.rejectedAt;
      } else if (matchingRequest && matchingRequest.rejected_date) {
        mergedSeller.rejectedDate = matchingRequest.rejected_date;
      }
      
      if (matchingRequest && matchingRequest.status) {
        mergedSeller.requestStatus = matchingRequest.status;
      }
      
      if (seller.account_status) {
        mergedSeller.accountStatus = seller.account_status;
      } else if (matchingUser && matchingUser.account_status) {
        mergedSeller.accountStatus = matchingUser.account_status;
      }
      
      if (seller.subscription_status) {
        mergedSeller.subscriptionStatus = seller.subscription_status;
      }
      
      if (seller.created_at) {
        mergedSeller.createdAt = seller.created_at;
      } else {
        mergedSeller.createdAt = new Date().toISOString();
      }
      
      if (seller.updated_at) {
        mergedSeller.updatedAt = seller.updated_at;
      } else {
        mergedSeller.updatedAt = new Date().toISOString();
      }
      
      if (matchingUser && matchingUser.last_login) {
        mergedSeller.lastLogin = matchingUser.last_login;
      } else if (seller.last_login) {
        mergedSeller.lastLogin = seller.last_login;
      }
      
      if (seller.account_status === 'deleted') {
        mergedSeller.deleted = true;
      }
      
      if (seller.deleted_at) {
        mergedSeller.deletedAt = seller.deleted_at;
      }
      
      if (seller.deleted_by) {
        mergedSeller.deletedBy = seller.deleted_by;
      }
      
      if (seller.deletion_reason) {
        mergedSeller.deletionReason = seller.deletion_reason;
      }
      
      if (seller.password_reset_sent) {
        mergedSeller.passwordResetSent = seller.password_reset_sent;
      }
      
      if (seller.password_reset_by) {
        mergedSeller.passwordResetBy = seller.password_reset_by;
      }
      
      const accountActive = (
        mergedSeller.accountStatus === 'active' || 
        !seller.account_status
      );
      
      const subscriptionActive = (
        mergedSeller.subscriptionStatus === 'active' || 
        !seller.subscription_status
      );
      
      mergedSeller.isActive = accountActive && subscriptionActive;
      
      try {
        let requestDateStr = '';
        
        if (matchingRequest && matchingRequest.requestedAt) {
          requestDateStr = matchingRequest.requestedAt;
        } else if (matchingRequest && matchingRequest.requested_date) {
          requestDateStr = matchingRequest.requested_date;
        }
        
        if (requestDateStr) {
          const requestDate = new Date(requestDateStr);
          if (!isNaN(requestDate.getTime())) {
            const diffMs = Date.now() - requestDate.getTime();
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            mergedSeller.daysSinceRequest = days >= 0 ? days : 0;
          }
        }
      } catch (error) {
        console.warn('Error calculating days:', error);
        mergedSeller.daysSinceRequest = 0;
      }
      
      mergedData.push(mergedSeller);
    }
    
    const validData = mergedData.filter(s => {
      return s.id && s.email && s.businessName && s.businessName !== 'Unknown';
    });
    
    console.log('✅ Merge complete:', {
      total: mergedData.length,
      valid: validData.length
    });
    
    return validData;
    
  } catch (error) {
    console.error('❌ Error in getSellersWithFullData:', error);
    return [];
  }
};

export const filterSellers = (
  sellers: any[], 
  filterOptions: {
    status?: 'all' | 'approved' | 'rejected' | 'pending' | 'active' | 'deleted';
    dateRange?: { start: Date; end: Date };
  }
): any[] => {
  try {
    let filtered = [...sellers];
    
    if (filterOptions.status && filterOptions.status !== 'all') {
      if (filterOptions.status === 'approved') {
        filtered = filtered.filter(s => s.requestStatus === 'approved');
      } else if (filterOptions.status === 'rejected') {
        filtered = filtered.filter(s => s.requestStatus === 'rejected');
      } else if (filterOptions.status === 'pending') {
        filtered = filtered.filter(s => s.requestStatus === 'pending');
      } else if (filterOptions.status === 'active') {
        filtered = filtered.filter(s => s.isActive);
      } else if (filterOptions.status === 'deleted') {
        filtered = filtered.filter(s => s.deleted);
      }
    }
    
    if (filterOptions.dateRange) {
      const { start, end } = filterOptions.dateRange;
      filtered = filtered.filter(s => {
        const requestDate = new Date(s.requestedDate);
        return requestDate >= start && requestDate <= end;
      });
    }
    
    return filtered;
  } catch (error) {
    console.error('❌ Error filtering sellers:', error);
    return sellers;
  }
};

export const searchSellers = (sellers: any[], searchQuery: string): any[] => {
  try {
    if (!searchQuery || !searchQuery.trim()) {
      return sellers;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return sellers.filter(seller => 
      seller.businessName?.toLowerCase().includes(query) ||
      seller.ownerName?.toLowerCase().includes(query) ||
      seller.email?.toLowerCase().includes(query) ||
      seller.phone?.toLowerCase().includes(query)
    );
  } catch (error) {
    console.error('❌ Error searching sellers:', error);
    return sellers;
  }
};

export const sendPasswordResetToSeller = async (
  sellerEmail: string,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔑 Sending password reset to seller:', sellerEmail);
    
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new Error('Only administrators can reset seller passwords');
    }
    
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      throw new Error('No authenticated admin found');
    }
    
    if (!validateEmail(sellerEmail)) {
      throw new Error('Invalid email address');
    }
    
    await sendPasswordResetEmail(auth, sellerEmail);
    
    console.log('✅ Password reset email sent by Firebase');
    
    const q = query(collection(db, 'sellers'), where('email', '==', sellerEmail));
    const sellersSnapshot = await getDocs(q);
    
    if (!sellersSnapshot.empty) {
      const sellerDoc = sellersSnapshot.docs[0];
      await updateDoc(doc(db, 'sellers', sellerDoc.id), {
        password_reset_sent: new Date().toISOString(),
        password_reset_by: currentAdmin.uid,
        updated_at: new Date().toISOString()
      });
      
      const userQuery = query(collection(db, 'users'), where('email', '==', sellerEmail));
      const usersSnapshot = await getDocs(userQuery);
      
      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          password_reset_sent: new Date().toISOString(),
          password_reset_by: currentAdmin.uid,
          updated_at: new Date().toISOString()
        });
      }
    }
    
    await addDoc(collection(db, 'adminLogs'), {
      action: 'password_reset_sent',
      admin_id: currentAdmin.uid,
      admin_email: currentAdmin.email,
      seller_email: sellerEmail,
      admin_notes: adminNotes || null,
      timestamp: new Date().toISOString(),
      success: true
    });
    
    await addDoc(collection(db, 'sellerCommunications'), {
      seller_email: sellerEmail,
      communication_type: 'password_reset',
      sent_at: new Date().toISOString(),
      sent_by: currentAdmin.uid,
      sent_by_email: currentAdmin.email,
      status: 'sent',
      subject: 'Password Reset Request',
      details: {
        admin_notes: adminNotes || null,
        reset_method: 'firebase_email'
      }
    });
    
    console.log('✅ Password reset completed successfully');
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error sending password reset:', error);
    
    try {
      const currentAdmin = auth.currentUser;
      if (currentAdmin) {
        await addDoc(collection(db, 'adminLogs'), {
          action: 'password_reset_failed',
          admin_id: currentAdmin.uid,
          admin_email: currentAdmin.email,
          seller_email: sellerEmail,
          error_message: error.message,
          timestamp: new Date().toISOString(),
          success: false
        });
      }
    } catch (logError) {
      console.warn('⚠️ Failed to log password reset error:', logError);
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to send password reset email'
    };
  }
};

export const softDeleteSellerAccount = async (
  sellerId: string,
  deletionReason?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🗑️ Starting soft delete for seller:', sellerId);
    
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new Error('Only administrators can delete seller accounts');
    }
    
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      throw new Error('No authenticated admin found');
    }
    
    const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
    
    if (!sellerDoc.exists()) {
      throw new Error('Seller not found');
    }
    
    const sellerData = sellerDoc.data();
    const deletionData = {
      account_status: 'deleted',
      deleted_at: new Date().toISOString(),
      deleted_by: currentAdmin.uid,
      deletion_reason: deletionReason || 'Admin action',
      updated_at: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'sellers', sellerId), deletionData);
    console.log('✅ Seller document updated');
    
    if (sellerData.user_id) {
      try {
        await updateDoc(doc(db, 'users', sellerData.user_id), deletionData);
        console.log('✅ User document updated');
      } catch (userError) {
        console.warn('⚠️ Could not update user document:', userError);
      }
    }
    
    const tilesQuery = query(
      collection(db, 'tiles'), 
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    
    const batch = writeBatch(db);
    tilesSnapshot.docs.forEach(tileDoc => {
      batch.update(tileDoc.ref, {
        status: 'archived',
        visible: false,
        archived_at: new Date().toISOString(),
        archived_reason: 'Seller account deleted'
      });
    });
    
    await batch.commit();
    console.log('✅ Tiles archived:', tilesSnapshot.size);
    
    await addDoc(collection(db, 'adminLogs'), {
      action: 'seller_account_deleted',
      admin_id: currentAdmin.uid,
      admin_email: currentAdmin.email,
      seller_id: sellerId,
      seller_email: sellerData.email,
      seller_business: sellerData.business_name,
      deletion_reason: deletionReason || 'Admin action',
      tiles_archived: tilesSnapshot.size,
      timestamp: new Date().toISOString(),
      success: true
    });
    
    await addDoc(collection(db, 'sellerCommunications'), {
      seller_id: sellerId,
      seller_email: sellerData.email,
      communication_type: 'account_deletion',
      sent_at: new Date().toISOString(),
      sent_by: currentAdmin.uid,
      sent_by_email: currentAdmin.email,
      status: 'pending',
      subject: 'Account Deactivation Notice',
      details: {
        deletion_reason: deletionReason || 'Admin action',
        tiles_archived: tilesSnapshot.size
      }
    });
    
    console.log('✅ Seller account soft deleted successfully');
    
    return { 
      success: true,
      sellerData: {
        email: sellerData.email,
        businessName: sellerData.business_name,
        ownerName: sellerData.owner_name
      }
    } as any;
    
  } catch (error: any) {
    console.error('❌ Error deleting seller account:', error);
    
    try {
      const currentAdmin = auth.currentUser;
      if (currentAdmin) {
        await addDoc(collection(db, 'adminLogs'), {
          action: 'seller_account_deletion_failed',
          admin_id: currentAdmin.uid,
          admin_email: currentAdmin.email,
          seller_id: sellerId,
          error_message: error.message,
          timestamp: new Date().toISOString(),
          success: false
        });
      }
    } catch (logError) {
      console.warn('⚠️ Failed to log deletion error:', logError);
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to delete seller account'
    };
  }
};

export const getSellerCommunications = async (sellerEmail: string): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'sellerCommunications'),
      where('seller_email', '==', sellerEmail),
      orderBy('sent_at', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching seller communications:', error);
    return [];
  }
};

export const getAdminLogs = async (limitCount: number = 100): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'adminLogs'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching admin logs:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ EXISTING FUNCTIONS (PRESERVED)
// ═══════════════════════════════════════════════════════════════

export const createSellerProfile = async (sellerData: Partial<TileSeller>): Promise<TileSeller> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  try {
    if (!sellerData.business_name?.trim() || !sellerData.user_id?.trim()) {
      throw new Error('Business name and user ID are required');
    }

    const docRef = await addDoc(collection(db, 'sellers'), {
      ...sellerData,
      id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subscription_status: 'active'
    });
    
    await updateDoc(docRef, { id: docRef.id });
    
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.data() as TileSeller;
  } catch (error) {
    console.error('Error creating seller profile:', error);
    throw error;
  }
};

export const getSellerProfile = async (userId: string): Promise<TileSeller | null> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Returning null for seller profile.');
    return null;
  }

  try {
    const q = query(collection(db, 'sellers'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No seller profile found for user:', userId);
      return null;
    }
    
    return querySnapshot.docs[0].data() as TileSeller;
  } catch (error: any) {
    console.warn('Seller profile not found or error occurred:', error.message);
    return null;
  }
};

export const getAllSellers = async (): Promise<TileSeller[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(collection(db, 'sellers'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as TileSeller);
  } catch (error) {
    console.error('Error getting all sellers:', error);
    return [];
  }
};

export const addToFavorites = async (tileId: string, showroomId: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Favorites not saved.');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await addDoc(collection(db, 'favorites'), {
      id: '',
      customer_id: user.uid,
      tile_id: tileId,
      showroom_id: showroomId,
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    if (!error.message.includes('duplicate')) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }
};

export const removeFromFavorites = async (tileId: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Favorites not removed.');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'favorites'),
      where('customer_id', '==', user.uid),
      where('tile_id', '==', tileId)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, 'favorites'),
      where('customer_id', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data().tile_id);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const getFavoritesByUserId = async (userId: string): Promise<string[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'favorites'),
      where('customer_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data().tile_id);
  } catch (error) {
    console.error('Error getting favorites by user ID:', error);
    return [];
  }
};

export const trackTileView = async (tileId: string, showroomId: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Tile view tracking skipped.');
    return;
  }

  try {
    const user = auth.currentUser;

    await addDoc(collection(db, 'analytics'), {
      tile_id: tileId,
      showroom_id: showroomId,
      action_type: 'view',
      customer_id: user?.uid || null,
      timestamp: new Date().toISOString(),
      session_id: `session_${Date.now()}`,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking tile view:', error);
  }
};

export const trackTileApplication = async (
  tileId: string,
  showroomId: string,
  surface: string,
  roomType: string
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Tile application tracking skipped.');
    return;
  }

  try {
    const user = auth.currentUser;

    await addDoc(collection(db, 'analytics'), {
      tile_id: tileId,
      showroom_id: showroomId,
      action_type: 'apply',
      surface_type: surface,
      room_type: roomType,
      customer_id: user?.uid || null,
      timestamp: new Date().toISOString(),
      session_id: `session_${Date.now()}`,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking tile application:', error);
  }
};

export const getTileAnalytics = async (showroomId: string): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Returning empty analytics.');
    return [];
  }

  try {
    const q = query(
      collection(db, 'analyticsSummary'),
      where('showroom_id', '==', showroomId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching tile analytics:', error);
    return [];
  }
};

export const getMostViewedTiles = async (showroomId: string, limitCount = 10): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Returning empty most viewed tiles.');
    return [];
  }

  try {
    const analyticsQuery = query(
      collection(db, 'analytics'),
      where('showroom_id', '==', showroomId),
      where('action_type', '==', 'view')
    );
    
    const analyticsSnapshot = await getDocs(analyticsQuery);
    
    const viewCounts: { [tileId: string]: number } = {};
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const tileId = data.tile_id;
      viewCounts[tileId] = (viewCounts[tileId] || 0) + 1;
    });

    const sortedTiles = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, count]) => ({
        tileId,
        viewCount: count
      }));

    const tilesWithDetails = await Promise.all(
      sortedTiles.map(async ({ tileId, viewCount }) => {
        const tile = await getTileById(tileId);
        return tile ? { ...tile, viewCount } : null;
      })
    );

    return tilesWithDetails.filter(Boolean);
  } catch (error) {
    console.error('Error fetching most viewed tiles:', error);
    return [];
  }
};

export const getMostTriedTiles = async (showroomId: string, limitCount = 10): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Returning empty most tried tiles.');
    return [];
  }

  try {
    const analyticsQuery = query(
      collection(db, 'analytics'),
      where('showroom_id', '==', showroomId),
      where('action_type', '==', 'apply')
    );
    
    const analyticsSnapshot = await getDocs(analyticsQuery);
    
    const applyCounts: { [tileId: string]: number } = {};
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const tileId = data.tile_id;
      applyCounts[tileId] = (applyCounts[tileId] || 0) + 1;
    });

    const sortedTiles = Object.entries(applyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, count]) => ({
        tileId,
        applyCount: count
      }));

    const tilesWithDetails = await Promise.all(
      sortedTiles.map(async ({ tileId, applyCount }) => {
        const tile = await getTileById(tileId);
        return tile ? { ...tile, applyCount } : null;
      })
    );

    return tilesWithDetails.filter(Boolean);
  } catch (error) {
    console.error('Error fetching most tried tiles:', error);
    return [];
  }
};

export const getSellerAnalytics = async (sellerId: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    return {
      totalTiles: 0,
      totalViews: 0,
      totalApplications: 0,
      popularTiles: [],
      recentActivity: []
    };
  }

  try {
    console.log('📊 Fetching analytics for seller:', sellerId);

    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    
    const tilesSnapshot = await getDocs(tilesQuery);
    const totalTiles = tilesSnapshot.size;
    const tileIds = tilesSnapshot.docs.map(doc => doc.id);

    if (tileIds.length === 0) {
      return {
        totalTiles: 0,
        totalViews: 0,
        totalApplications: 0,
        popularTiles: [],
        recentActivity: []
      };
    }

    const analyticsQuery = query(
      collection(db, 'analytics'),
      where('tile_id', 'in', tileIds.slice(0, 10))
    );
    
    const analyticsSnapshot = await getDocs(analyticsQuery);
    
    let totalViews = 0;
    let totalApplications = 0;
    const tileStats: { [tileId: string]: { views: number; applications: number } } = {};

    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const tileId = data.tile_id;
      
      if (!tileStats[tileId]) {
        tileStats[tileId] = { views: 0, applications: 0 };
      }

      if (data.action_type === 'view') {
        totalViews++;
        tileStats[tileId].views++;
      } else if (data.action_type === 'apply') {
        totalApplications++;
        tileStats[tileId].applications++;
      }
    });

    const popularTiles = Object.entries(tileStats)
      .sort(([, a], [, b]) => (b.views + b.applications) - (a.views + a.applications))
      .slice(0, 5)
      .map(([tileId, stats]) => {
        const tile = tilesSnapshot.docs.find(doc => doc.id === tileId);
        return tile ? {
          id: tileId,
          name: tile.data().name,
          imageUrl: tile.data().imageUrl,
          views: stats.views,
          applications: stats.applications
        } : null;
      })
      .filter(Boolean);

    console.log('✅ Analytics fetched:', {
      totalTiles,
      totalViews,
      totalApplications
    });

    return {
      totalTiles,
      totalViews,
      totalApplications,
      popularTiles,
      recentActivity: []
    };
  } catch (error) {
    console.error('❌ Error fetching seller analytics:', error);
    return {
      totalTiles: 0,
      totalViews: 0,
      totalApplications: 0,
      popularTiles: [],
      recentActivity: []
    };
  }
};
// ✅ APPROVED SELLERS (Jo approve ho chuke)
export const getApprovedSellers = async () => {
  try {
    const q = query(
      collection(db, 'sellerRequests'),
      where('status', '==', 'approved'),
      orderBy('approvalDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const approved: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      approved.push({
        id: doc.id,
        businessName: data.businessName || '',
        ownerName: data.ownerName || '',
        email: data.email || '',
        phone: data.phone || '',
        approvalDate: data.approvalDate || data.approval_date || '',
        requestedAt: data.requestedAt || data.requested_at || '',
        status: 'approved'
      });
    });
    
    return approved;
  } catch (error) {
    console.error('Error fetching approved sellers:', error);
    return [];
  }
};

// ✅ PENDING REQUESTS
export const getPendingRequests = async () => {
  try {
    const q = query(
      collection(db, 'sellerRequests'),
      where('status', '==', 'pending'),
      orderBy('requestedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const pending: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      pending.push({
        id: doc.id,
        businessName: data.businessName || '',
        ownerName: data.ownerName || '',
        email: data.email || '',
        phone: data.phone || '',
        requestedAt: data.requestedAt || data.requested_at || new Date().toISOString(),
        status: 'pending'
      });
    });
    
    return pending;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};

// ✅ REJECTED REQUESTS
export const getRejectedRequests = async () => {
  try {
    const q = query(
      collection(db, 'sellerRequests'),
      where('status', '==', 'rejected'),
      orderBy('rejectedAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const rejected: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      rejected.push({
        id: doc.id,
        businessName: data.businessName || '',
        ownerName: data.ownerName || '',
        email: data.email || '',
        phone: data.phone || '',
        requestedAt: data.requestedAt || data.requested_at || '',
        rejectedAt: data.rejectedAt || data.rejected_at || '',
        rejectionReason: data.rejectionReason || data.rejection_reason || 'No reason provided',
        status: 'rejected'
      });
    });
    
    return rejected;
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
    return [];
  }
};

export const getAllAnalytics = async (): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    return [];
  }
};

export const uploadTile = async (tileData: any, sellerId?: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  try {
    const user = auth.currentUser;
    
    const {
      id,
      seller_id,
      showroom_id,
      qr_code,
      qr_code_url,
      created_at,
      updated_at,
      ...cleanData
    } = tileData;

    const finalTileData = {
      ...cleanData,
      sellerId: tileData.sellerId || sellerId || user?.uid,
      showroomId: tileData.showroomId || tileData.sellerId || sellerId || user?.uid,
      qrCode: tileData.qrCode || null,
      qrCodeUrl: tileData.qrCodeUrl || null,
      createdAt: tileData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('💾 Saving tile:', finalTileData.name);

    const docRef = await addDoc(collection(db, 'tiles'), finalTileData);
    
    console.log('✅ Tile saved with ID:', docRef.id);
    
    const docSnap = await getDoc(docRef);
    
    return { 
      id: docRef.id,
      ...docSnap.data() 
    };
    
  } catch (error) {
    console.error('❌ Error uploading tile:', error);
    throw error;
  }
};

export const uploadBulkTiles = async (tilesData: any[], sellerId?: string): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  try {
    const user = auth.currentUser;
    const results = [];
    
    for (const tile of tilesData) {
      const {
        seller_id,
        showroom_id,
        qr_code,
        qr_code_url,
        created_at,
        updated_at,
        ...cleanData
      } = tile;

      const finalTileData = {
        ...cleanData,
        id: tile.id || `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sellerId: tile.sellerId || sellerId || user?.uid,
        showroomId: tile.showroomId || tile.sellerId || sellerId || user?.uid,
        qrCode: tile.qrCode || null,
        qrCodeUrl: tile.qrCodeUrl || null,
        createdAt: tile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'tiles'), finalTileData);
      const docSnap = await getDoc(docRef);
      results.push({ id: docRef.id, ...docSnap.data() });
    }
    
    console.log(`✅ Bulk upload completed: ${results.length} tiles`);
    return results;
  } catch (error) {
    console.error('❌ Error uploading bulk tiles:', error);
    throw error;
  }
};

export const updateTile = async (tileId: string, updates: any): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  try {
    console.log('🔄 Updating tile:', tileId);
    
    const {
      id,
      seller_id,
      showroom_id,
      qr_code,
      qr_code_url,
      created_at,
      updated_at,
      ...cleanUpdates
    } = updates;

    const finalUpdates = {
      ...cleanUpdates,
      qrCode: updates.qrCode || updates.qr_code || null,
      qrCodeUrl: updates.qrCodeUrl || updates.qr_code_url || null,
      updatedAt: new Date().toISOString()
    };

    const tileRef = doc(db, 'tiles', tileId);
    
    const docSnap = await getDoc(tileRef);
    if (!docSnap.exists()) {
      throw new Error(`Tile ${tileId} not found in database`);
    }
    
    await updateDoc(tileRef, finalUpdates);
    
    console.log('✅ Tile updated successfully');
    
    const updatedDoc = await getDoc(tileRef);
    return { 
      id: updatedDoc.id, 
      ...updatedDoc.data() 
    };
    
  } catch (error: any) {
    console.error('❌ Error updating tile:', error);
    throw error;
  }
};

export const deleteTile = async (tileId: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  try {
    console.log('🔥 Deleting tile:', tileId);
    
    const tileRef = doc(db, 'tiles', tileId);
    
    const docSnap = await getDoc(tileRef);
    if (!docSnap.exists()) {
      throw new Error(`Tile ${tileId} not found in database`);
    }
    
    console.log('📋 Tile found:', docSnap.data().name);
    
    await deleteDoc(tileRef);
    
    console.log('✅ Tile deleted from Firebase');
    
  } catch (error: any) {
    console.error('❌ Delete failed:', error.message);
    throw error;
  }
};

export const getSellerTiles = async (sellerId?: string): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const userId = sellerId || auth.currentUser?.uid;
    if (!userId) {
      console.log('⚠️ No seller ID available');
      return [];
    }

    console.log('🔍 Fetching tiles for seller:', userId);

    const q1 = query(
      collection(db, 'tiles'),
      where('sellerId', '==', userId)
    );
    
    const q2 = query(
      collection(db, 'tiles'),
      where('seller_id', '==', userId)
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    const tiles1 = snapshot1.docs.map(doc => {
      const { id: _, ...data } = doc.data();
      return { 
        id: doc.id,
        ...data 
      };
    });
    
    const tiles2 = snapshot2.docs.map(doc => {
      const { id: _, ...data } = doc.data();
      return { 
        id: doc.id, 
        ...data 
      };
    });

    const allTiles = [...tiles1, ...tiles2];
    const uniqueTiles = Array.from(
      new Map(allTiles.map(tile => [tile.id, tile])).values()
    );

    console.log('✅ Tiles fetched:', {
      camelCase: tiles1.length,
      snake_case: tiles2.length,
      total: uniqueTiles.length
    });

    return uniqueTiles;
  } catch (error) {
    console.error('❌ Error getting seller tiles:', error);
    return [];
  }
};

export const getAllTiles = async (): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'tiles'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Error getting all tiles:', error);
    return [];
  }
};

export const getTileById = async (tileId: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const docSnap = await getDoc(doc(db, 'tiles', tileId));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting tile by ID:', error);
    return null;
  }
};
export const changeSellerPassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    console.log('🔐 Starting password change for:', email);

    // Step 1: Get current user
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user found. Please log in again.');
    }

    if (user.email !== email) {
      throw new Error('Email mismatch. Please log in with the correct account.');
    }

    // Step 2: Re-authenticate with current password (security requirement)
    console.log('🔑 Re-authenticating user...');
    
    const credential = EmailAuthProvider.credential(email, currentPassword);
    
    try {
      await reauthenticateWithCredential(user, credential);
      console.log('✅ Re-authentication successful');
    } catch (authError: any) {
      console.error('❌ Re-authentication failed:', authError);
      
      if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        throw new Error('Current password is incorrect. Please try again.');
      } else if (authError.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please wait a few minutes and try again.');
      } else {
        throw new Error('Authentication failed. Please try again.');
      }
    }

    // Step 3: Update password in Firebase Auth
    console.log('🔄 Updating password in Firebase Auth...');
    
    try {
      await updatePassword(user, newPassword);
      console.log('✅ Password updated in Firebase Auth');
    } catch (updateError: any) {
      console.error('❌ Password update failed:', updateError);
      
      if (updateError.code === 'auth/weak-password') {
        throw new Error('New password is too weak. Please choose a stronger password.');
      } else if (updateError.code === 'auth/requires-recent-login') {
        throw new Error('For security, please log out and log in again before changing your password.');
      } else {
        throw new Error('Failed to update password. Please try again.');
      }
    }

    // Step 4: Update password change timestamp in Firestore (optional but recommended)
    try {
      const sellerQuery = query(
        collection(db, 'sellers'),
        where('email', '==', email)
      );
      const sellerSnapshot = await getDocs(sellerQuery);
      
      if (!sellerSnapshot.empty) {
        const sellerDoc = sellerSnapshot.docs[0];
        await updateDoc(doc(db, 'sellers', sellerDoc.id), {
          password_changed: true,
          password_changed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        console.log('✅ Password change logged in Firestore');
      }

      // Also update in users collection
      if (user.uid) {
        await updateDoc(doc(db, 'users', user.uid), {
          password_changed: true,
          password_changed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (logError) {
      console.warn('⚠️ Could not log password change (non-critical):', logError);
      // Don't throw error here - password was changed successfully
    }

    // Step 5: Log password change activity
    try {
      await addDoc(collection(db, 'sellerActivity'), {
        seller_id: user.uid,
        seller_email: email,
        activity_type: 'password_changed',
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (logError) {
      console.warn('⚠️ Could not log activity:', logError);
    }

    console.log('🎉 Password change completed successfully');

  } catch (error: any) {
    console.error('❌ Password change failed:', error);
    throw error;
  }
};
export const updateTileQRCode = async (tileId: string, qrCode: string, qrCodeUrl?: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  try {
    const tileRef = doc(db, 'tiles', tileId);
    const updates = {
      qrCode: qrCode,
      qrCodeUrl: qrCodeUrl || null,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(tileRef, updates);
    
    const updatedDoc = await getDoc(tileRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('❌ Error updating tile QR code:', error);
    throw error;
  }
};

export const getTileByQRScan = async (tileId: string, showroomId: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const q = query(
      collection(db, 'tiles'),
      where('id', '==', tileId),
      where('showroomId', '==', showroomId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching tile by QR scan:', error);
    return null;
  }
};

export const getSellerTilesWithQR = async (sellerId: string): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Error fetching seller tiles with QR:', error);
    return [];
  }
};

export const submitSellerRequest = async (requestData: any): Promise<string> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured. Please set up your Firebase credentials.');
  }

  try {
    console.log('📝 Submitting seller request:', requestData);

    const docRef = await addDoc(collection(db, 'sellerRequests'), {
      ...requestData,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      adminNotes: null,
      reviewedAt: null,
      reviewedBy: null
    });

    console.log('✅ Seller request submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error submitting seller request:', error);
    throw error;
  }
};

export const getAllSellerRequests = async (): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can view seller requests.');
    }

    const q = query(
      collection(db, 'sellerRequests'),
      orderBy('requestedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching seller requests:', error);
    return [];
  }
};

export const getPendingSellerRequests = async (): Promise<any[]> => {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can view seller requests.');
    }

    const q = query(
      collection(db, 'sellerRequests'),
      where('status', '==', 'pending'),
      orderBy('requestedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching pending seller requests:', error);
    return [];
  }
};

export const updateSellerRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured.');
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can update seller request status.');
    }

    const requestRef = doc(db, 'sellerRequests', requestId);
    
    await updateDoc(requestRef, {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: currentUser.id,
      adminNotes: adminNotes || null
    });

    console.log(`✅ Seller request ${requestId} ${status}`);
  } catch (error) {
    console.error(`❌ Error updating seller request status:`, error);
    throw error;
  }
};

export const getSellerRequestById = async (requestId: string): Promise<any> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const docSnap = await getDoc(doc(db, 'sellerRequests', requestId));
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching seller request:', error);
    return null;
  }
};

export const uploadTileWithImage = async (
  tileData: any,
  imageFile?: File,
  textureFile?: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  try {
    console.log('📸 uploadTileWithImage called - use cloudinaryUtils for image upload');
    return await uploadTile(tileData);
  } catch (error: any) {
    console.error('Error uploading tile with images:', error);
    throw error;
  }
};

export const trackQRScan = async (
  tileId: string, 
  scanData: any
): Promise<void> => {
  try {
    await addDoc(collection(db, 'qr_scans'), {
      tileId,
      sellerId: scanData.sellerId,
      showroomId: scanData.showroomId,
      scannedAt: new Date().toISOString(),
      deviceType: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: `session_${Date.now()}`
    });
    
    console.log('✅ QR scan tracked');
  } catch (error) {
    console.error('Failed to track QR scan:', error);
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ SELLER ANALYTICS & ACTIVITY TRACKING - NEW SECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Get complete seller analytics overview
 */
export const getSellerAnalyticsOverview = async (sellerId: string): Promise<any> => {
  try {
    console.log('📊 Fetching complete analytics for seller:', sellerId);

    // Parallel fetch all data
    const [tilesSnapshot, analyticsSnapshot, qrScansSnapshot, sellerDoc] = await Promise.all([
      getDocs(query(collection(db, 'tiles'), where('sellerId', '==', sellerId))),
      getDocs(query(collection(db, 'analytics'))),
      getDocs(query(collection(db, 'qr_scans'))),
      getDoc(doc(db, 'sellers', sellerId))
    ]);

    const tiles = tilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const tileIds = tiles.map(t => t.id);

    // Filter analytics for this seller's tiles
    const sellerAnalytics = analyticsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((a: any) => tileIds.includes(a.tile_id));

    // Filter QR scans for this seller's tiles
    const sellerQRScans = qrScansSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((s: any) => tileIds.includes(s.tileId));

    // Calculate totals
    const totalTiles = tiles.length;
    const totalViews = sellerAnalytics.filter((a: any) => a.action_type === 'view').length;
    const totalApplies = sellerAnalytics.filter((a: any) => a.action_type === 'apply').length;
    const totalQRScans = sellerQRScans.length;

    // Get seller info
    const sellerData = sellerDoc.exists() ? sellerDoc.data() : {};

    console.log('✅ Analytics overview calculated:', {
      totalTiles,
      totalViews,
      totalApplies,
      totalQRScans
    });

    return {
      sellerId,
      businessName: sellerData.business_name || 'Unknown',
      email: sellerData.email || '',
      phone: sellerData.phone || '',
      accountStatus: sellerData.account_status || 'active',
      totalTiles,
      totalViews,
      totalApplies,
      totalQRScans,
      tiles,
      analytics: sellerAnalytics,
      qrScans: sellerQRScans,
      lastLogin: sellerData.last_login || null,
      createdAt: sellerData.created_at || null
    };
  } catch (error) {
    console.error('❌ Error fetching seller analytics overview:', error);
    return {
      sellerId,
      totalTiles: 0,
      totalViews: 0,
      totalApplies: 0,
      totalQRScans: 0,
      tiles: [],
      analytics: [],
      qrScans: []
    };
  }
};

/**
 * Get top viewed tiles for a seller
 */
export const getSellerTopViewedTiles = async (
  sellerId: string, 
  limitCount: number = 5
): Promise<any[]> => {
  try {
    console.log('📊 Fetching top viewed tiles for seller:', sellerId);

    // Get seller's tiles
    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tiles = tilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const tileIds = tiles.map(t => t.id);

    if (tileIds.length === 0) {
      return [];
    }

    // Get all analytics
    const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
    
    // Count views per tile
    const viewCounts: { [tileId: string]: number } = {};
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.action_type === 'view' && tileIds.includes(data.tile_id)) {
        viewCounts[data.tile_id] = (viewCounts[data.tile_id] || 0) + 1;
      }
    });

    // Sort and get top tiles
    const sortedTiles = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, viewCount]) => {
        const tile = tiles.find(t => t.id === tileId);
        return {
          id: tileId,
          name: tile?.name || 'Unknown',
          imageUrl: tile?.imageUrl || '',
          category: tile?.category || '',
          size: tile?.size || '',
          price: tile?.price || 0,
          viewCount
        };
      });

    console.log('✅ Top viewed tiles:', sortedTiles.length);
    return sortedTiles;
  } catch (error) {
    console.error('❌ Error fetching top viewed tiles:', error);
    return [];
  }
};

/**
 * Get top QR scanned tiles for a seller
 */
export const getSellerTopQRScannedTiles = async (
  sellerId: string,
  limitCount: number = 5
): Promise<any[]> => {
  try {
    console.log('📱 Fetching top QR scanned tiles for seller:', sellerId);

    // Get seller's tiles
    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tiles = tilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const tileIds = tiles.map(t => t.id);

    if (tileIds.length === 0) {
      return [];
    }

    // Get all QR scans
    const qrScansSnapshot = await getDocs(collection(db, 'qr_scans'));
    
    // Count scans per tile
    const scanCounts: { [tileId: string]: number } = {};
    qrScansSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (tileIds.includes(data.tileId)) {
        scanCounts[data.tileId] = (scanCounts[data.tileId] || 0) + 1;
      }
    });

    // Sort and get top tiles
    const sortedTiles = Object.entries(scanCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, scanCount]) => {
        const tile = tiles.find(t => t.id === tileId);
        return {
          id: tileId,
          name: tile?.name || 'Unknown',
          imageUrl: tile?.imageUrl || '',
          category: tile?.category || '',
          size: tile?.size || '',
          price: tile?.price || 0,
          scanCount
        };
      });

    console.log('✅ Top QR scanned tiles:', sortedTiles.length);
    return sortedTiles;
  } catch (error) {
    console.error('❌ Error fetching top QR scanned tiles:', error);
    return [];
  }
};

/**
 * Ensure seller has user profile (required for worker creation)
 */
export const ensureSellerUserProfile = async (sellerId: string): Promise<void> => {
  try {
    console.log('🔍 Checking seller user profile...');
    
    const userDoc = await getDoc(doc(db, 'users', sellerId));
    
    if (userDoc.exists()) {
      console.log('✅ Seller user profile exists');
      return;
    }

    console.log('⚠️ Seller user profile missing - creating...');

    // Get seller data from sellers collection
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('user_id', '==', sellerId)
    );
    const sellerSnapshot = await getDocs(sellerQuery);

    if (sellerSnapshot.empty) {
      throw new Error('Seller business profile not found');
    }

    const sellerData = sellerSnapshot.docs[0].data();

    // Create user profile for seller
    await setDoc(doc(db, 'users', sellerId), {
      id: sellerId,
      user_id: sellerId,
      email: sellerData.email || auth.currentUser?.email || '',
      full_name: sellerData.owner_name || sellerData.business_name || 'Seller',
      role: 'seller',
      account_status: 'active',
      created_at: sellerData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true,
      onboarding_completed: true,
      permissions: ['manage_tiles', 'view_analytics', 'manage_workers']
    });

    console.log('✅ Seller user profile created');

  } catch (error) {
    console.error('❌ Error ensuring seller user profile:', error);
    throw error;
  }
};
export const getSellerDailyActivity = async (
  sellerId: string,
  days: number = 7
): Promise<any[]> => {
  try {
    console.log('⏰ Fetching daily activity for seller:', sellerId, 'days:', days);

    // Get seller's tiles
    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tileIds = tilesSnapshot.docs.map(doc => doc.id);

    if (tileIds.length === 0) {
      return [];
    }

    // Get all analytics
    const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
    
    // Group by date
    const activityByDate: { [date: string]: { views: number; applies: number; actions: number } } = {};
    
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (tileIds.includes(data.tile_id) && data.timestamp) {
        const date = new Date(data.timestamp).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = { views: 0, applies: 0, actions: 0 };
        }
        
        if (data.action_type === 'view') {
          activityByDate[date].views++;
        } else if (data.action_type === 'apply') {
          activityByDate[date].applies++;
        }
        activityByDate[date].actions++;
      }
    });

    // Generate last N days
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = activityByDate[dateStr] || { views: 0, applies: 0, actions: 0 };
      
      result.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: dayData.views,
        applies: dayData.applies,
        actions: dayData.actions,
        // Estimate hours (assuming 10 actions = 1 hour of activity)
        estimatedHours: (dayData.actions / 10).toFixed(1)
      });
    }

    console.log('✅ Daily activity calculated for', result.length, 'days');
    return result;
  } catch (error) {
    console.error('❌ Error fetching daily activity:', error);
    return [];
  }
};

/**
 * Get all sellers with basic analytics (for list view)
 */
export const getAllSellersWithAnalytics = async (): Promise<any[]> => {
  try {
    console.log('📊 Fetching all sellers with analytics...');

    const sellersSnapshot = await getDocs(collection(db, 'sellers'));
    
    const sellersWithStats = await Promise.all(
      sellersSnapshot.docs.map(async (sellerDoc) => {
        const sellerData = sellerDoc.data();
        const sellerId = sellerDoc.id;

        // Get tile count
        const tilesQuery = query(
          collection(db, 'tiles'),
          where('sellerId', '==', sellerId)
        );
        const tilesSnapshot = await getDocs(tilesQuery);
        const tileCount = tilesSnapshot.size;

        // Get last login from users collection
        let lastLogin = sellerData.last_login || null;
        if (sellerData.user_id) {
          try {
            const userDoc = await getDoc(doc(db, 'users', sellerData.user_id));
            if (userDoc.exists()) {
              lastLogin = userDoc.data().last_login || lastLogin;
            }
          } catch (e) {
            console.warn('Could not fetch user data for:', sellerId);
          }
        }

        return {
          id: sellerId,
          businessName: sellerData.business_name || 'Unknown',
          ownerName: sellerData.owner_name || 'Unknown',
          email: sellerData.email || '',
          phone: sellerData.phone || '',
          accountStatus: sellerData.account_status || 'active',
          subscriptionStatus: sellerData.subscription_status || 'active',
          tileCount,
          lastLogin,
          createdAt: sellerData.created_at || '',
          isActive: sellerData.account_status === 'active' || !sellerData.account_status
        };
      })
    );

    // Sort by tile count (most tiles first)
    sellersWithStats.sort((a, b) => b.tileCount - a.tileCount);

    console.log('✅ Sellers with analytics fetched:', sellersWithStats.length);
    return sellersWithStats;
  } catch (error) {
    console.error('❌ Error fetching sellers with analytics:', error);
    return [];
  }
};

/**
 * Track seller activity session
 */
export const trackSellerActivity = async (
  sellerId: string,
  activityType: 'login' | 'dashboard_view' | 'tile_upload' | 'tile_edit' | 'logout',
  metadata?: any
): Promise<void> => {
  try {
    await addDoc(collection(db, 'sellerActivity'), {
      seller_id: sellerId,
      activity_type: activityType,
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
      session_id: `session_${Date.now()}`
    });
    console.log('✅ Seller activity tracked:', activityType);
  } catch (error) {
    console.warn('⚠️ Could not track seller activity:', error);
  }
};
// ═══════════════════════════════════════════════════════════════
// ✅ WORKER MANAGEMENT FUNCTIONS - NEW SECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate secure random password for worker
 */
export const generateWorkerPassword = (): string => {
  const length = 12;
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = "";
  
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill remaining characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Create worker account for a seller
 * @param sellerEmail - Seller's email (for verification)
 * @param workerEmail - Worker's email
 * @returns Worker details with generated password
 */
// export const createWorkerAccount = async (
//   sellerEmail: string,
//   workerEmail: string
// ): Promise<{
//   success: boolean;
//   workerId?: string;
//   workerEmail?: string;
//   generatedPassword?: string;
//   error?: string;
// }> => {
//   try {
//     console.log('🔄 Creating worker account...');
//     console.log('Seller:', sellerEmail);
//     console.log('Worker email:', workerEmail);

//     // Step 1: Get current authenticated seller
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error('No authenticated user. Please log in.');
//     }

//     if (currentUser.email !== sellerEmail) {
//       throw new Error('Email mismatch. Please log in with correct seller account.');
//     }

//     // Step 2: Get seller profile
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('email', '==', sellerEmail)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);

//     if (sellerSnapshot.empty) {
//       throw new Error('Seller profile not found.');
//     }

//     const sellerDoc = sellerSnapshot.docs[0];
//     const sellerData = sellerDoc.data();
//     const sellerId = currentUser.uid;

//     // Step 3: Check if seller already has a worker
//     if (sellerData.worker_id) {
//       throw new Error('You already have a worker. Please delete the existing worker first.');
//     }

//     // Step 4: Validate worker email
//     if (!validateEmail(workerEmail)) {
//       throw new Error('Invalid email format.');
//     }

//     // Step 5: Check if worker email already exists
//     const existingUserQuery = query(
//       collection(db, 'users'),
//       where('email', '==', workerEmail)
//     );
//     const existingUserSnapshot = await getDocs(existingUserQuery);

//     if (!existingUserSnapshot.empty) {
//       throw new Error('Email already in use. Please use a different email.');
//     }

//     // Step 6: Generate secure password
//     const generatedPassword = generateWorkerPassword();
//     console.log('✅ Password generated');

//     // Step 7: Create Firebase Auth user (using secondary app)
//     console.log('🔄 Creating Firebase Auth account...');
    
//     const secondaryApp = initializeApp(
//       {
//         apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//         authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//         projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//         storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//         messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//         appId: import.meta.env.VITE_FIREBASE_APP_ID
//       },
//       `secondary-worker-${Date.now()}`
//     );

//     const secondaryAuth = getAuth(secondaryApp);
//     let workerCredential;

//     try {
//       workerCredential = await createUserWithEmailAndPassword(
//         secondaryAuth,
//         workerEmail,
//         generatedPassword
//       );
//       console.log('✅ Firebase Auth account created:', workerCredential.user.uid);
//     } catch (authError: any) {
//       console.error('❌ Firebase Auth error:', authError);
//       await deleteApp(secondaryApp);
//       throw new Error(`Failed to create worker account: ${authError.message}`);
//     }

//     const workerId = workerCredential.user.uid;

//     // Step 8: Sign out from secondary auth and cleanup
//     await firebaseSignOut(secondaryAuth);
//     await deleteApp(secondaryApp);
//     console.log('✅ Secondary auth cleaned up');

//     // Step 9: Verify main seller session still active
//     if (auth.currentUser?.uid !== currentUser.uid) {
//       throw new Error('Seller session lost during worker creation');
//     }

//     // Step 10: Create worker user profile
//     const workerProfile: Partial<UserProfile> = {
//       id: workerId,
//       user_id: workerId,
//       email: workerEmail,
//       full_name: `Worker (${sellerData.business_name || 'Showroom'})`,
//       role: 'worker',
//       seller_id: sellerId,
//       is_active: true,
//       account_status: 'active',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       created_by: sellerId,
//       onboarding_completed: true,
//       permissions: []
//     };

//     await setDoc(doc(db, 'users', workerId), workerProfile);
//     console.log('✅ Worker user profile created');

//     // Step 11: Update seller document
//     await updateDoc(doc(db, 'sellers', sellerDoc.id), {
//       worker_id: workerId,
//       worker_email: workerEmail,
//       worker_created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     });
//     console.log('✅ Seller document updated');

//     // Step 12: Store temporary password (expires in 24 hours)
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 24);

//     await setDoc(doc(db, 'worker_credentials', workerId), {
//       worker_id: workerId,
//       seller_id: sellerId,
//       generated_password: generatedPassword,
//       created_at: new Date().toISOString(),
//       viewed: false,
//       expires_at: expiresAt.toISOString()
//     });
//     console.log('✅ Temporary password stored');

//     // Step 13: Log activity
//     await addDoc(collection(db, 'adminLogs'), {
//       action: 'worker_account_created',
//       seller_id: sellerId,
//       seller_email: sellerEmail,
//       worker_id: workerId,
//       worker_email: workerEmail,
//       timestamp: new Date().toISOString(),
//       success: true
//     });

//     console.log('🎉 Worker account created successfully');

//     return {
//       success: true,
//       workerId,
//       workerEmail,
//       generatedPassword
//     };

//   } catch (error: any) {
//     console.error('❌ Error creating worker account:', error);

//     // Log failure
//     try {
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         await addDoc(collection(db, 'adminLogs'), {
//           action: 'worker_account_creation_failed',
//           seller_id: currentUser.uid,
//           seller_email: sellerEmail,
//           attempted_worker_email: workerEmail,
//           error_message: error.message,
//           timestamp: new Date().toISOString(),
//           success: false
//         });
//       }
//     } catch (logError) {
//       console.warn('Failed to log error:', logError);
//     }

//     return {
//       success: false,
//       error: error.message || 'Failed to create worker account'
//     };
//   }
// };
export const createWorkerAccount = async (
  sellerEmail: string,
  workerEmail: string
): Promise<{
  success: boolean;
  workerId?: string;
  workerEmail?: string;
  generatedPassword?: string;
  error?: string;
}> => {
  
  // ─────────────────────────────────────────────────────────────
  // 🔧 PHASE 1: VALIDATION & INITIALIZATION
  // ─────────────────────────────────────────────────────────────
  
  const startTime = Date.now();
  let workerId: string | null = null;
  let secondaryApp: FirebaseApp | null = null;
  let authAccountCreated = false;

  try {
    console.log('🔄 Creating worker account...');
    console.log('📧 Seller:', sellerEmail);
    console.log('👤 Worker:', workerEmail);

    // ✅ Validate inputs
    if (!sellerEmail?.trim() || !workerEmail?.trim()) {
      throw new Error('Seller email and worker email are required');
    }

    if (!validateEmail(sellerEmail.trim())) {
      throw new Error('Invalid seller email format');
    }

    if (!validateEmail(workerEmail.trim())) {
      throw new Error('Invalid worker email format');
    }

    if (sellerEmail.toLowerCase().trim() === workerEmail.toLowerCase().trim()) {
      throw new Error('Worker email must be different from seller email');
    }

    // ✅ Get current authenticated seller
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('❌ No authenticated user. Please log in as seller.');
    }

    if (currentUser.email?.toLowerCase().trim() !== sellerEmail.toLowerCase().trim()) {
      throw new Error(
        `❌ Email mismatch. Logged in as ${currentUser.email}, but trying to create worker for ${sellerEmail}`
      );
    }

    const sellerId = currentUser.uid;
    console.log('✅ Seller authenticated:', sellerId);
    // ✅ 🔧 NEW: Ensure seller has user profile
    await ensureSellerUserProfile(sellerId);
    // ─────────────────────────────────────────────────────────────
    // 🔧 PHASE 2: SELLER VERIFICATION
    // ─────────────────────────────────────────────────────────────

    // ✅ Get seller profile
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('email', '==', sellerEmail.toLowerCase().trim())
    );
    const sellerSnapshot = await getDocs(sellerQuery);

    if (sellerSnapshot.empty) {
      throw new Error('❌ Seller profile not found in database');
    }

    const sellerDoc = sellerSnapshot.docs[0];
    const sellerData = sellerDoc.data();

    console.log('✅ Seller profile loaded:', sellerData.business_name || 'Unknown');

    // ✅ Check if seller already has a worker
    if (sellerData.worker_id) {
      // Verify worker still exists
      try {
        const existingWorkerDoc = await getDoc(doc(db, 'users', sellerData.worker_id));
        
        if (existingWorkerDoc.exists() && existingWorkerDoc.data().account_status !== 'deleted') {
          const existingWorkerData = existingWorkerDoc.data();
          throw new Error(
            `❌ You already have an active worker (${existingWorkerData.email}). Please delete the existing worker first.`
          );
        } else {
          // Orphaned worker_id - clear it
          console.log('⚠️ Orphaned worker_id found, clearing...');
          await updateDoc(doc(db, 'sellers', sellerDoc.id), {
            worker_id: null,
            worker_email: null,
            updated_at: new Date().toISOString()
          });
        }
      } catch (workerCheckError) {
        console.warn('⚠️ Could not verify existing worker:', workerCheckError);
      }
    }

    // ✅ Check if worker email already exists
    const existingUserQuery = query(
      collection(db, 'users'),
      where('email', '==', workerEmail.toLowerCase().trim())
    );
    const existingUserSnapshot = await getDocs(existingUserQuery);

    if (!existingUserSnapshot.empty) {
      throw new Error(`❌ Email "${workerEmail}" is already registered in the system`);
    }

    console.log('✅ Worker email available');

    // ─────────────────────────────────────────────────────────────
    // 🔧 PHASE 3: PASSWORD GENERATION
    // ─────────────────────────────────────────────────────────────

    const generatedPassword = generateWorkerPassword();
    console.log('✅ Secure password generated (12 characters)');

    // ─────────────────────────────────────────────────────────────
    // 🔧 PHASE 4: FIREBASE AUTH ACCOUNT CREATION
    // ─────────────────────────────────────────────────────────────

    console.log('🔄 Creating Firebase Auth account...');

    try {
      secondaryApp = initializeApp(
        {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID
        },
        `secondary-worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      );

      const secondaryAuth = getAuth(secondaryApp);

      const workerCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        workerEmail.trim(),
        generatedPassword
      );

      workerId = workerCredential.user.uid;
      authAccountCreated = true;

      console.log('✅ Firebase Auth account created:', workerId);

      // Immediately sign out to prevent session conflicts
      await firebaseSignOut(secondaryAuth);
      console.log('✅ Secondary auth signed out');

      // Cleanup secondary app
      await deleteApp(secondaryApp);
      secondaryApp = null;
      console.log('✅ Secondary app deleted');

    } catch (authError: any) {
      console.error('❌ Firebase Auth creation failed:', authError);

      // Cleanup secondary app if exists
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
          secondaryApp = null;
        } catch (cleanupError) {
          console.warn('⚠️ Secondary app cleanup warning:', cleanupError);
        }
      }

      // Better error messages
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('❌ Email already in use in Firebase Auth. Please use a different email.');
      } else if (authError.code === 'auth/weak-password') {
        throw new Error('❌ Generated password is too weak (this should not happen)');
      } else if (authError.code === 'auth/invalid-email') {
        throw new Error('❌ Invalid email format');
      } else {
        throw new Error(`❌ Auth creation failed: ${authError.message}`);
      }
    }

    // ✅ Verify main seller session still active
    if (!auth.currentUser || auth.currentUser.uid !== sellerId) {
      throw new Error('❌ Seller session lost during worker creation. Please log in again.');
    }

    console.log('✅ Seller session verified - still logged in');

    // ─────────────────────────────────────────────────────────────
    // 🔧 PHASE 5: FIRESTORE DATA CREATION
    // ─────────────────────────────────────────────────────────────

    console.log('🔄 Creating Firestore records...');

    try {
      // ✅ Create worker user profile
      const workerProfile: Partial<UserProfile> = {
        id: workerId!,
        user_id: workerId!,
        email: workerEmail.toLowerCase().trim(),
        full_name: `Worker - ${sellerData.business_name || sellerData.owner_name || 'Showroom'}`,
        role: 'worker',
        seller_id: sellerId,
        is_active: true,
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: sellerId,
        onboarding_completed: true,
        permissions: ['view_tiles', 'scan_qr', 'view_analytics']
      };

      await setDoc(doc(db, 'users', workerId!), workerProfile);
      console.log('✅ Worker user profile created');

      // ✅ Update seller document
      await updateDoc(doc(db, 'sellers', sellerDoc.id), {
        worker_id: workerId,
        worker_email: workerEmail.toLowerCase().trim(),
        worker_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log('✅ Seller document updated');

      // ✅ Store temporary credentials (expires in 24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await setDoc(doc(db, 'worker_credentials', workerId!), {
        worker_id: workerId,
        seller_id: sellerId,
        email: workerEmail.toLowerCase().trim(),
        generated_password: generatedPassword,
        created_at: new Date().toISOString(),
        viewed: false,
        expires_at: expiresAt.toISOString()
      });
      console.log('✅ Temporary credentials stored (expires in 24h)');

      // ✅ Log worker activity
      await addDoc(collection(db, 'workerActivity'), {
        worker_id: workerId,
        seller_id: sellerId,
        action: 'WORKER_ACCOUNT_CREATED',
        details: {
          worker_email: workerEmail,
          created_by: sellerEmail
        },
        timestamp: new Date().toISOString()
      });
      console.log('✅ Worker activity logged');

      // ✅ Log admin activity
      await addDoc(collection(db, 'adminLogs'), {
        action: 'worker_account_created',
        seller_id: sellerId,
        seller_email: sellerEmail,
        worker_id: workerId,
        worker_email: workerEmail,
        business_name: sellerData.business_name || 'Unknown',
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: true
      });
      console.log('✅ Admin log created');

    } catch (firestoreError: any) {
      console.error('❌ Firestore creation failed:', firestoreError);

      // ─────────────────────────────────────────────────────────────
      // 🔧 ROLLBACK: Delete Firebase Auth account if Firestore fails
      // ─────────────────────────────────────────────────────────────
      
      if (authAccountCreated && workerId) {
        console.log('🔄 Rolling back Firebase Auth account...');
        
        try {
          // Log orphaned account for admin cleanup
          await addDoc(collection(db, 'orphanedAccounts'), {
            userId: workerId,
            email: workerEmail,
            reason: 'firestore_creation_failed',
            error: firestoreError.message,
            createdAt: new Date().toISOString(),
            seller_id: sellerId,
            needs_cleanup: true
          });
          console.log('✅ Orphaned account logged for cleanup');
        } catch (logError) {
          console.error('⚠️ Could not log orphaned account:', logError);
        }
      }

      throw new Error(`❌ Failed to create worker profile: ${firestoreError.message}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 🔧 PHASE 6: SUCCESS
    // ─────────────────────────────────────────────────────────────

    const totalTime = Date.now() - startTime;
    console.log(`🎉 Worker account created successfully in ${totalTime}ms`);

    return {
      success: true,
      workerId: workerId!,
      workerEmail: workerEmail.trim(),
      generatedPassword
    };

  } catch (error: any) {
    // ─────────────────────────────────────────────────────────────
    // 🔧 ERROR HANDLING
    // ─────────────────────────────────────────────────────────────

    console.error('❌ Worker account creation failed:', error);

    const totalTime = Date.now() - startTime;

    // Cleanup secondary app if still exists
    if (secondaryApp) {
      try {
        await deleteApp(secondaryApp);
        console.log('✅ Secondary app cleaned up after error');
      } catch (cleanupError) {
        console.warn('⚠️ Secondary app cleanup error:', cleanupError);
      }
    }

    // Log failure
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await addDoc(collection(db, 'adminLogs'), {
          action: 'worker_account_creation_failed',
          seller_id: currentUser.uid,
          seller_email: sellerEmail,
          attempted_worker_email: workerEmail,
          error_message: error.message,
          error_code: error.code || 'unknown',
          phase: authAccountCreated ? 'firestore_creation' : 'auth_creation',
          duration_ms: totalTime,
          timestamp: new Date().toISOString(),
          success: false
        });
      }
    } catch (logError) {
      console.warn('⚠️ Failed to log error:', logError);
    }

    return {
      success: false,
      error: error.message || 'Failed to create worker account. Please try again.'
    };
  }
};
/**
 * Get seller's worker account
 * @param sellerId - Seller's user ID
 * @returns Worker profile or null
 */
// export const getSellerWorker = async (sellerId: string): Promise<UserProfile | null> => {
//   try {
//     console.log('🔍 Fetching worker for seller:', sellerId);

//     const workerQuery = query(
//       collection(db, 'users'),
//       where('seller_id', '==', sellerId),
//       where('role', '==', 'worker')
//     );

//     const workerSnapshot = await getDocs(workerQuery);

//     if (workerSnapshot.empty) {
//       console.log('No worker found for this seller');
//       return null;
//     }

//     const workerDoc = workerSnapshot.docs[0];
//     const workerData = workerDoc.data() as UserProfile;

//     console.log('✅ Worker found:', workerData.email);
//     return workerData;

//   } catch (error) {
//     console.error('❌ Error fetching worker:', error);
//     return null;
//   }
// };

/**
 * Get seller's worker account (PRODUCTION v2.0 - Filters Deleted)
 * @param sellerId - Seller's user ID
 * @returns Worker profile or null
 */
export const getSellerWorker = async (sellerId: string): Promise<UserProfile | null> => {
  try {
    console.log('🔍 Fetching worker for seller:', sellerId);

    const workerQuery = query(
      collection(db, 'users'),
      where('seller_id', '==', sellerId),
      where('role', '==', 'worker')
    );

    const workerSnapshot = await getDocs(workerQuery);

    if (workerSnapshot.empty) {
      console.log('ℹ️ No worker found for this seller');
      return null;
    }

    // ✅ PRODUCTION FIX: Filter out deleted/inactive workers
    for (const workerDoc of workerSnapshot.docs) {
      const workerData = workerDoc.data() as UserProfile;
      
      // Skip deleted or inactive workers
      if (
        workerData.account_status === 'deleted' || 
        workerData.is_active === false
      ) {
        console.log('⚠️ Skipping deleted/inactive worker:', workerData.email);
        continue;
      }

      // Found active worker
      console.log('✅ Active worker found:', workerData.email);
      return workerData;
    }

    // No active worker found
    console.log('ℹ️ No active worker found (all deleted/inactive)');
    return null;

  } catch (error) {
    console.error('❌ Error fetching worker:', error);
    return null;
  }
};
/**
 * Update worker email
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 * @param newEmail - New email address
 */
export const updateWorkerEmail = async (
  workerId: string,
  sellerId: string,
  newEmail: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Updating worker email...');

    // Verify worker belongs to seller
    const workerDoc = await getDoc(doc(db, 'users', workerId));
    if (!workerDoc.exists()) {
      throw new Error('Worker not found');
    }

    const workerData = workerDoc.data();
    if (workerData.seller_id !== sellerId) {
      throw new Error('Unauthorized: Worker does not belong to this seller');
    }

    // Validate new email
    if (!validateEmail(newEmail)) {
      throw new Error('Invalid email format');
    }

    // Check if new email already exists
    const existingQuery = query(
      collection(db, 'users'),
      where('email', '==', newEmail)
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error('Email already in use');
    }

    // Update Firestore
    await updateDoc(doc(db, 'users', workerId), {
      email: newEmail,
      updated_at: new Date().toISOString()
    });

    // Update seller's worker_email
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('worker_id', '==', workerId)
    );
    const sellerSnapshot = await getDocs(sellerQuery);

    if (!sellerSnapshot.empty) {
      const sellerDoc = sellerSnapshot.docs[0];
      await updateDoc(doc(db, 'sellers', sellerDoc.id), {
        worker_email: newEmail,
        updated_at: new Date().toISOString()
      });
    }

    // Log activity
    await addDoc(collection(db, 'adminLogs'), {
      action: 'worker_email_updated',
      worker_id: workerId,
      seller_id: sellerId,
      new_email: newEmail,
      timestamp: new Date().toISOString(),
      success: true
    });

    console.log('✅ Worker email updated successfully');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Error updating worker email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset worker password
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 * @returns New generated password
 */
// export const resetWorkerPassword = async (
//   workerId: string,
//   sellerId: string
// ): Promise<{ success: boolean; generatedPassword?: string; error?: string }> => {
//   try {
//     console.log('🔄 Resetting worker password...');

//     // Verify worker belongs to seller
//     const workerDoc = await getDoc(doc(db, 'users', workerId));
//     if (!workerDoc.exists()) {
//       throw new Error('Worker not found');
//     }

//     const workerData = workerDoc.data();
//     if (workerData.seller_id !== sellerId) {
//       throw new Error('Unauthorized: Worker does not belong to this seller');
//     }

//     // Generate new password
//     const newPassword = generateWorkerPassword();
//     console.log('✅ New password generated');

//     // Update Firebase Auth password
//     // Note: This requires Firebase Admin SDK in production
//     // For now, sending password reset email
//     await sendPasswordResetEmail(auth, workerData.email);
//     console.log('✅ Password reset email sent');

//     // Update temporary credentials storage
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 24);

//     await setDoc(doc(db, 'worker_credentials', workerId), {
//       worker_id: workerId,
//       seller_id: sellerId,
//       generated_password: newPassword,
//       created_at: new Date().toISOString(),
//       viewed: false,
//       expires_at: expiresAt.toISOString()
//     });

//     // Update seller document
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('worker_id', '==', workerId)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);

//     if (!sellerSnapshot.empty) {
//       const sellerDoc = sellerSnapshot.docs[0];
//       await updateDoc(doc(db, 'sellers', sellerDoc.id), {
//         worker_last_password_reset: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       });
//     }

//     // Log activity
//     await addDoc(collection(db, 'adminLogs'), {
//       action: 'worker_password_reset',
//       worker_id: workerId,
//       seller_id: sellerId,
//       timestamp: new Date().toISOString(),
//       success: true
//     });

//     console.log('✅ Worker password reset successfully');
//     return { success: true, generatedPassword: newPassword };

//   } catch (error: any) {
//     console.error('❌ Error resetting worker password:', error);
//     return { success: false, error: error.message };
//   }
// };
/**
 * Reset worker password (FIXED v2.0)
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 * @returns Success message (no password returned)
 */
// export const resetWorkerPassword = async (
//   workerId: string,
//   sellerId: string
// ): Promise<{ 
//   success: boolean; 
//   method: 'email_sent' | 'password_generated';
//   generatedPassword?: string; 
//   error?: string 
// }> => {
//   try {
//     console.log('🔄 Resetting worker password...');

//     // ✅ Verify worker belongs to seller
//     const workerDoc = await getDoc(doc(db, 'users', workerId));
//     if (!workerDoc.exists()) {
//       throw new Error('Worker not found');
//     }

//     const workerData = workerDoc.data();
//     if (workerData.seller_id !== sellerId) {
//       throw new Error('Unauthorized: Worker does not belong to this seller');
//     }

//     // ═══════════════════════════════════════════════════════════
//     // ✅ OPTION 1: Email-Only Reset (SAFE & RECOMMENDED)
//     // ═══════════════════════════════════════════════════════════
    
//     console.log('📧 Sending password reset email to:', workerData.email);
    
//     try {
//       await sendPasswordResetEmail(auth, workerData.email);
//       console.log('✅ Password reset email sent successfully');
//     } catch (emailError: any) {
//       console.error('❌ Failed to send reset email:', emailError);
//       throw new Error('Failed to send password reset email. Please try again.');
//     }

//     // ✅ Update seller document
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('worker_id', '==', workerId)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);

//     if (!sellerSnapshot.empty) {
//       const sellerDoc = sellerSnapshot.docs[0];
//       await updateDoc(doc(db, 'sellers', sellerDoc.id), {
//         worker_last_password_reset: new Date().toISOString(),
//         worker_reset_method: 'email_link',
//         updated_at: new Date().toISOString()
//       });
//     }

//     // ✅ Log activity
//     await addDoc(collection(db, 'adminLogs'), {
//       action: 'worker_password_reset_email_sent',
//       worker_id: workerId,
//       worker_email: workerData.email,
//       seller_id: sellerId,
//       reset_method: 'email_link',
//       timestamp: new Date().toISOString(),
//       success: true
//     });

//     // ✅ Track worker activity
//     await addDoc(collection(db, 'workerActivity'), {
//       worker_id: workerId,
//       seller_id: sellerId,
//       action: 'PASSWORD_RESET_INITIATED',
//       details: {
//         reset_method: 'email_link',
//         initiated_by: sellerId
//       },
//       timestamp: new Date().toISOString()
//     });

//     console.log('✅ Password reset process completed');

//     return { 
//       success: true, 
//       method: 'email_sent'
//     };

//   } catch (error: any) {
//     console.error('❌ Error resetting worker password:', error);

//     // Log failure
//     try {
//       await addDoc(collection(db, 'adminLogs'), {
//         action: 'worker_password_reset_failed',
//         worker_id: workerId,
//         seller_id: sellerId,
//         error_message: error.message,
//         timestamp: new Date().toISOString(),
//         success: false
//       });
//     } catch (logError) {
//       console.warn('⚠️ Failed to log error:', logError);
//     }

//     return { 
//       success: false, 
//       method: 'email_sent',
//       error: error.message 
//     };
//   }
// };
/**
 * Reset worker password - SIMPLE VERSION (Production Ready)
 * Deletes old worker and creates new one with new password
 */
// export const resetWorkerPassword = async (
//   workerId: string,
//   sellerId: string
// ): Promise<{
//   success: boolean;
//   generatedPassword?: string;
//   workerEmail?: string;
//   error?: string;
// }> => {
  
//   let secondaryApp: FirebaseApp | null = null;

//   try {
//     console.log('🔄 Resetting worker password...');

//     // Get worker details
//     const workerDoc = await getDoc(doc(db, 'users', workerId));
//     if (!workerDoc.exists()) {
//       throw new Error('Worker not found');
//     }

//     const workerData = workerDoc.data();
    
//     if (workerData.seller_id !== sellerId) {
//       throw new Error('Unauthorized');
//     }

//     const workerEmail = workerData.email;
//     const workerName = workerData.full_name;
//     const workerCreatedAt = workerData.created_at;

//     console.log('✅ Worker found:', workerEmail);

//     // Soft delete old worker in Firestore
//     await updateDoc(doc(db, 'users', workerId), {
//       account_status: 'deleted',
//       is_active: false,
//       deleted_at: new Date().toISOString(),
//       deleted_by: sellerId,
//       updated_at: new Date().toISOString()
//     });

//     console.log('✅ Old worker deleted');

//     // Wait for Firebase propagation (3 seconds minimum)
//     await new Promise(resolve => setTimeout(resolve, 3000));

//     // Generate new password
//     const newPassword = generateWorkerPassword();
//     console.log('✅ New password generated');

//     // Create new Firebase Auth account
//     console.log('🔄 Creating new account...');

//     secondaryApp = initializeApp(
//       {
//         apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//         authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//         projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//         storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//         messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//         appId: import.meta.env.VITE_FIREBASE_APP_ID
//       },
//       `temp-${Date.now()}`
//     );

//     const secondaryAuth = getAuth(secondaryApp);
    
//     let newWorkerCredential;
    
//     try {
//       newWorkerCredential = await createUserWithEmailAndPassword(
//         secondaryAuth,
//         workerEmail,
//         newPassword
//       );
//       console.log('✅ New account created');
//     } catch (authError: any) {
//       // Cleanup
//       if (secondaryApp) {
//         await deleteApp(secondaryApp);
//       }

//       // Handle "email in use" error
//       if (authError.code === 'auth/email-already-in-use') {
//         throw new Error(
//           'Please wait 1 minute and try again. Firebase needs time to process the deletion.'
//         );
//       }
      
//       throw new Error('Failed to create new account: ' + authError.message);
//     }

//     const newWorkerId = newWorkerCredential.user.uid;

//     // Cleanup secondary auth
//     await firebaseSignOut(secondaryAuth);
//     await deleteApp(secondaryApp);
    
//     // Create new Firestore profile
//     const newWorkerProfile: Partial<UserProfile> = {
//       id: newWorkerId,
//       user_id: newWorkerId,
//       email: workerEmail,
//       full_name: workerName,
//       role: 'worker',
//       seller_id: sellerId,
//       is_active: true,
//       account_status: 'active',
//       created_at: workerCreatedAt,
//       updated_at: new Date().toISOString(),
//       created_by: sellerId,
//       onboarding_completed: true,
//       permissions: ['view_tiles', 'scan_qr', 'view_analytics']
//     };

//     await setDoc(doc(db, 'users', newWorkerId), newWorkerProfile);

//     // Update seller document
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('worker_id', '==', workerId)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);

//     if (!sellerSnapshot.empty) {
//       await updateDoc(doc(db, 'sellers', sellerSnapshot.docs[0].id), {
//         worker_id: newWorkerId,
//         worker_email: workerEmail,
//         updated_at: new Date().toISOString()
//       });
//     }

//     // Store credentials
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 24);

//     await setDoc(doc(db, 'worker_credentials', newWorkerId), {
//       worker_id: newWorkerId,
//       seller_id: sellerId,
//       email: workerEmail,
//       generated_password: newPassword,
//       created_at: new Date().toISOString(),
//       viewed: false,
//       expires_at: expiresAt.toISOString()
//     });

//     // Log activity
//     await addDoc(collection(db, 'adminLogs'), {
//       action: 'worker_password_reset',
//       old_worker_id: workerId,
//       new_worker_id: newWorkerId,
//       worker_email: workerEmail,
//       seller_id: sellerId,
//       timestamp: new Date().toISOString(),
//       success: true
//     });

//     console.log('🎉 Password reset complete!');

//     return {
//       success: true,
//       generatedPassword: newPassword,
//       workerEmail: workerEmail
//     };

//   } catch (error: any) {
//     console.error('❌ Reset failed:', error);

//     if (secondaryApp) {
//       try {
//         await deleteApp(secondaryApp);
//       } catch (e) {}
//     }

//     return {
//       success: false,
//       error: error.message || 'Failed to reset password'
//     };
//   }
// };
/**
 * Reset worker password (PRODUCTION v2.0 - Fixed Password Return)
 * Deletes old worker and creates new one with new password
 */
export const resetWorkerPassword = async (
  workerId: string,
  sellerId: string
): Promise<{
  success: boolean;
  generatedPassword?: string;
  workerEmail?: string;
  error?: string;
}> => {
  
  let secondaryApp: FirebaseApp | null = null;
  let newPassword: string | null = null;
  let workerEmail: string | null = null;

  try {
    console.log('🔄 Starting password reset for worker:', workerId);

    // ═══════════════════════════════════════════════════════════
    // STEP 1: GET WORKER DETAILS
    // ═══════════════════════════════════════════════════════════
    
    const workerDoc = await getDoc(doc(db, 'users', workerId));
    if (!workerDoc.exists()) {
      throw new Error('Worker not found');
    }

    const workerData = workerDoc.data();
    
    if (workerData.seller_id !== sellerId) {
      throw new Error('Unauthorized: Worker does not belong to this seller');
    }

    workerEmail = workerData.email;
    const workerName = workerData.full_name;
    const workerCreatedAt = workerData.created_at;

    console.log('✅ Worker verified:', workerEmail);

    // ═══════════════════════════════════════════════════════════
    // STEP 2: SOFT DELETE OLD WORKER
    // ═══════════════════════════════════════════════════════════
    
    await updateDoc(doc(db, 'users', workerId), {
      account_status: 'deleted',
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: sellerId,
      deletion_reason: 'password_reset',
      updated_at: new Date().toISOString()
    });

    console.log('✅ Old worker marked as deleted');

    // ═══════════════════════════════════════════════════════════
    // STEP 3: WAIT FOR FIREBASE AUTH PROPAGATION
    // ═══════════════════════════════════════════════════════════
    
    console.log('⏳ Waiting 3 seconds for Firebase Auth cleanup...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ═══════════════════════════════════════════════════════════
    // STEP 4: GENERATE NEW PASSWORD
    // ═══════════════════════════════════════════════════════════
    
    newPassword = generateWorkerPassword();
    console.log('✅ New password generated');

    // ═══════════════════════════════════════════════════════════
    // STEP 5: CREATE NEW FIREBASE AUTH ACCOUNT
    // ═══════════════════════════════════════════════════════════
    
    console.log('🔄 Creating new Firebase Auth account...');

    secondaryApp = initializeApp(
      {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      },
      `secondary-reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );

    const secondaryAuth = getAuth(secondaryApp);
    
    let newWorkerCredential;
    
    try {
      newWorkerCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        workerEmail,
        newPassword
      );
      console.log('✅ New Firebase Auth account created');
    } catch (authError: any) {
      console.error('❌ Firebase Auth error:', authError);
      
      // Cleanup
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
          secondaryApp = null;
        } catch (cleanupErr) {
          console.warn('⚠️ Cleanup warning:', cleanupErr);
        }
      }

      // Handle email-in-use error
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error(
          'Please wait 1 minute and try again. Firebase needs time to process the deletion.'
        );
      }
      
      throw new Error(`Auth account creation failed: ${authError.message}`);
    }

    const newWorkerId = newWorkerCredential.user.uid;

    // ═══════════════════════════════════════════════════════════
    // STEP 6: CLEANUP SECONDARY AUTH
    // ═══════════════════════════════════════════════════════════
    
    await firebaseSignOut(secondaryAuth);
    await deleteApp(secondaryApp);
    secondaryApp = null;
    console.log('✅ Secondary auth cleaned up');

    // ═══════════════════════════════════════════════════════════
    // STEP 7: CREATE NEW FIRESTORE PROFILE
    // ═══════════════════════════════════════════════════════════
    
    const newWorkerProfile: Partial<UserProfile> = {
      id: newWorkerId,
      user_id: newWorkerId,
      email: workerEmail,
      full_name: workerName,
      role: 'worker',
      seller_id: sellerId,
      is_active: true,
      account_status: 'active',
      created_at: workerCreatedAt, // Preserve original creation date
      updated_at: new Date().toISOString(),
      created_by: sellerId,
      onboarding_completed: true,
      permissions: ['view_tiles', 'scan_qr', 'view_analytics']
    };

    await setDoc(doc(db, 'users', newWorkerId), newWorkerProfile);
    console.log('✅ New worker profile created');

    // ═══════════════════════════════════════════════════════════
    // STEP 8: UPDATE SELLER DOCUMENT
    // ═══════════════════════════════════════════════════════════
    
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('worker_id', '==', workerId)
    );
    const sellerSnapshot = await getDocs(sellerQuery);

    if (!sellerSnapshot.empty) {
      await updateDoc(doc(db, 'sellers', sellerSnapshot.docs[0].id), {
        worker_id: newWorkerId,
        worker_email: workerEmail,
        worker_last_password_reset: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log('✅ Seller document updated');
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 9: STORE TEMPORARY CREDENTIALS (24h)
    // ═══════════════════════════════════════════════════════════
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await setDoc(doc(db, 'worker_credentials', newWorkerId), {
      worker_id: newWorkerId,
      seller_id: sellerId,
      email: workerEmail,
      generated_password: newPassword,
      created_at: new Date().toISOString(),
      viewed: false,
      expires_at: expiresAt.toISOString()
    });
    console.log('✅ Temporary credentials stored');

    // ═══════════════════════════════════════════════════════════
    // STEP 10: LOG ACTIVITY
    // ═══════════════════════════════════════════════════════════
    
    await addDoc(collection(db, 'adminLogs'), {
      action: 'worker_password_reset',
      old_worker_id: workerId,
      new_worker_id: newWorkerId,
      worker_email: workerEmail,
      seller_id: sellerId,
      timestamp: new Date().toISOString(),
      success: true
    });

    await addDoc(collection(db, 'workerActivity'), {
      worker_id: newWorkerId,
      seller_id: sellerId,
      action: 'PASSWORD_RESET',
      details: {
        old_worker_id: workerId,
        reset_by: sellerId
      },
      timestamp: new Date().toISOString()
    });

    console.log('🎉 Password reset completed successfully');

    // ✅ PRODUCTION FIX: Return complete data
    return {
      success: true,
      generatedPassword: newPassword!,
      workerEmail: workerEmail!
    };

  } catch (error: any) {
    console.error('❌ Password reset failed:', error);

    // Cleanup if needed
    if (secondaryApp) {
      try {
        await deleteApp(secondaryApp);
      } catch (cleanupErr) {
        console.warn('⚠️ Cleanup error:', cleanupErr);
      }
    }

    // Log failure
    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'worker_password_reset_failed',
        worker_id: workerId,
        seller_id: sellerId,
        error_message: error.message,
        timestamp: new Date().toISOString(),
        success: false
      });
    } catch (logErr) {
      console.warn('⚠️ Logging error:', logErr);
    }

    return {
      success: false,
      error: error.message || 'Failed to reset password'
    };
  }
};

/**
 * 
 * 
 * Toggle worker active status
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 * @param isActive - New active status
 */
export const toggleWorkerStatus = async (
  workerId: string,
  sellerId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Toggling worker status to:', isActive);

    // Verify worker belongs to seller
    const workerDoc = await getDoc(doc(db, 'users', workerId));
    if (!workerDoc.exists()) {
      throw new Error('Worker not found');
    }

    const workerData = workerDoc.data();
    if (workerData.seller_id !== sellerId) {
      throw new Error('Unauthorized: Worker does not belong to this seller');
    }

    // Update worker status
    await updateDoc(doc(db, 'users', workerId), {
      is_active: isActive,
      updated_at: new Date().toISOString()
    });

    // Log activity
    await addDoc(collection(db, 'adminLogs'), {
      action: isActive ? 'worker_enabled' : 'worker_disabled',
      worker_id: workerId,
      seller_id: sellerId,
      timestamp: new Date().toISOString(),
      success: true
    });

    console.log(`✅ Worker ${isActive ? 'enabled' : 'disabled'} successfully`);
    return { success: true };

  } catch (error: any) {
    console.error('❌ Error toggling worker status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete worker account
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 */
// export const deleteWorkerAccount = async (
//   workerId: string,
//   sellerId: string
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     console.log('🔄 Deleting worker account...');

//     // Verify worker belongs to seller
//     const workerDoc = await getDoc(doc(db, 'users', workerId));
//     if (!workerDoc.exists()) {
//       throw new Error('Worker not found');
//     }

//     const workerData = workerDoc.data();
//     if (workerData.seller_id !== sellerId) {
//       throw new Error('Unauthorized: Worker does not belong to this seller');
//     }

//     // Soft delete: Update worker status
//     await updateDoc(doc(db, 'users', workerId), {
//       account_status: 'deleted',
//       is_active: false,
//       deleted_at: new Date().toISOString(),
//       deleted_by: sellerId,
//       updated_at: new Date().toISOString()
//     });

//     // Update seller document
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('worker_id', '==', workerId)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);

//     if (!sellerSnapshot.empty) {
//       const sellerDoc = sellerSnapshot.docs[0];
//       await updateDoc(doc(db, 'sellers', sellerDoc.id), {
//         worker_id: null,
//         worker_email: null,
//         updated_at: new Date().toISOString()
//       });
//     }

//     // Delete temporary credentials
//     try {
//       await deleteDoc(doc(db, 'worker_credentials', workerId));
//     } catch (e) {
//       console.warn('No temporary credentials to delete');
//     }

//     // Log activity
//     await addDoc(collection(db, 'adminLogs'), {
//       action: 'worker_account_deleted',
//       worker_id: workerId,
//       worker_email: workerData.email,
//       seller_id: sellerId,
//       timestamp: new Date().toISOString(),
//       success: true
//     });

//     console.log('✅ Worker account deleted successfully');
//     return { success: true };

//   } catch (error: any) {
//     console.error('❌ Error deleting worker account:', error);
//     return { success: false, error: error.message };
//   }
// };

/**
 * Delete worker account (PRODUCTION v2.0 - Complete Cleanup)
 * @param workerId - Worker's user ID
 * @param sellerId - Seller's user ID (for verification)
 */
export const deleteWorkerAccount = async (
  workerId: string,
  sellerId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Starting worker deletion:', workerId);

    // ═══════════════════════════════════════════════════════════
    // STEP 1: VERIFY WORKER OWNERSHIP
    // ═══════════════════════════════════════════════════════════
    
    const workerDoc = await getDoc(doc(db, 'users', workerId));
    if (!workerDoc.exists()) {
      throw new Error('Worker not found');
    }

    const workerData = workerDoc.data();
    if (workerData.seller_id !== sellerId) {
      throw new Error('Unauthorized: Worker does not belong to this seller');
    }

    // Check if already deleted
    if (workerData.account_status === 'deleted') {
      console.log('⚠️ Worker already deleted');
      return { success: true };
    }

    const workerEmail = workerData.email;
    console.log('✅ Worker verified for deletion:', workerEmail);

    // ═══════════════════════════════════════════════════════════
    // STEP 2: SOFT DELETE IN USERS COLLECTION
    // ═══════════════════════════════════════════════════════════
    
    await updateDoc(doc(db, 'users', workerId), {
      account_status: 'deleted',
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: sellerId,
      updated_at: new Date().toISOString()
    });
    console.log('✅ Worker marked as deleted');

    // ═══════════════════════════════════════════════════════════
    // STEP 3: UPDATE SELLER DOCUMENT - CLEAR WORKER_ID
    // ═══════════════════════════════════════════════════════════
    
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('worker_id', '==', workerId)
    );
    const sellerSnapshot = await getDocs(sellerQuery);

    if (!sellerSnapshot.empty) {
      const sellerDoc = sellerSnapshot.docs[0];
      await updateDoc(doc(db, 'sellers', sellerDoc.id), {
        worker_id: null,
        worker_email: null,
        worker_deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log('✅ Seller document updated - worker_id cleared');
    } else {
      console.warn('⚠️ Seller document not found');
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 4: DELETE TEMPORARY CREDENTIALS
    // ═══════════════════════════════════════════════════════════
    
    try {
      const credDoc = await getDoc(doc(db, 'worker_credentials', workerId));
      if (credDoc.exists()) {
        await deleteDoc(doc(db, 'worker_credentials', workerId));
        console.log('✅ Temporary credentials deleted');
      }
    } catch (credError) {
      console.warn('⚠️ No credentials to delete');
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 5: LOG ACTIVITY
    // ═══════════════════════════════════════════════════════════
    
    await addDoc(collection(db, 'adminLogs'), {
      action: 'worker_account_deleted',
      worker_id: workerId,
      worker_email: workerEmail,
      seller_id: sellerId,
      timestamp: new Date().toISOString(),
      success: true
    });

    await addDoc(collection(db, 'workerActivity'), {
      worker_id: workerId,
      seller_id: sellerId,
      action: 'WORKER_ACCOUNT_DELETED',
      details: {
        worker_email: workerEmail,
        deleted_by: sellerId
      },
      timestamp: new Date().toISOString()
    });

    console.log('🎉 Worker deletion completed successfully');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Worker deletion failed:', error);

    // Log failure
    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'worker_account_deletion_failed',
        worker_id: workerId,
        seller_id: sellerId,
        error_message: error.message,
        timestamp: new Date().toISOString(),
        success: false
      });
    } catch (logError) {
      console.warn('⚠️ Logging error:', logError);
    }

    return { success: false, error: error.message };
  }
};

/**
 * Check if worker belongs to seller (security helper)
 */
export const isWorkerOwnedBySeller = async (
  workerId: string,
  sellerId: string
): Promise<boolean> => {
  try {
    const workerDoc = await getDoc(doc(db, 'users', workerId));
    if (!workerDoc.exists()) return false;

    const workerData = workerDoc.data();
    return workerData.seller_id === sellerId && workerData.role === 'worker';
  } catch (error) {
    console.error('Error verifying worker ownership:', error);
    return false;
  }
};
// ✅ ADD THIS FUNCTION after other worker functions:

/**
 * Track worker activity for analytics
 */
export const trackWorkerActivity = async (
  workerId: string,
  activityType: 'login' | 'logout' | 'scan' | 'tile_view',
  metadata?: any
): Promise<void> => {
  try {
    await addDoc(collection(db, 'workerActivity'), {
      worker_id: workerId,
      activity_type: activityType,
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
      device_type: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      user_agent: navigator.userAgent.substring(0, 200), // Truncate for storage
      session_id: `worker_${Date.now()}`
    });
  } catch (error) {
    console.warn('Could not track worker activity:', error);
  }
};
// ═══════════════════════════════════════════════════════════════
// ✅ SELLER STOCK ANALYTICS FUNCTIONS - NEW SECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Get complete seller scan analytics with stock data
 * @param sellerId - Seller's user ID
 * @returns Array of tiles with scan analytics
 */
// export const getSellerScanAnalytics = async (sellerId: string): Promise<any[]> => {
//   try {
//     console.log('📊 Fetching scan analytics for seller:', sellerId);

//     // Step 1: Get seller's tiles
//     const tilesQuery = query(
//       collection(db, 'tiles'),
//       where('sellerId', '==', sellerId)
//     );
//     const tilesSnapshot = await getDocs(tilesQuery);
    
//     if (tilesSnapshot.empty) {
//       console.log('No tiles found for seller');
//       return [];
//     }

//     const tiles = tilesSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     const tileIds = tiles.map(t => t.id);
//     console.log('✅ Found tiles:', tiles.length);

//     // Step 2: Get all QR scans for these tiles
//     let allScans: any[] = [];
    
//     // Firestore 'in' query limit is 10, so batch if needed
//     const batchSize = 10;
//     for (let i = 0; i < tileIds.length; i += batchSize) {
//       const batch = tileIds.slice(i, i + batchSize);
      
//       const scansQuery = query(
//         collection(db, 'qr_scans'),
//         where('tileId', 'in', batch)
//       );
      
//       const scansSnapshot = await getDocs(scansQuery);
//       const batchScans = scansSnapshot.docs.map(doc => doc.data());
//       allScans = [...allScans, ...batchScans];
//     }

//     console.log('✅ Found scans:', allScans.length);

//     // Step 3: Aggregate scan data per tile
//     const scanCounts: { [tileId: string]: { count: number; lastScanned: string | null } } = {};
    
//     allScans.forEach(scan => {
//       const tileId = scan.tileId;
      
//       if (!scanCounts[tileId]) {
//         scanCounts[tileId] = {
//           count: 0,
//           lastScanned: null
//         };
//       }
      
//       scanCounts[tileId].count++;
      
//       // Track most recent scan
//       const scanTime = scan.scannedAt || scan.scanned_at;
//       if (scanTime) {
//         if (!scanCounts[tileId].lastScanned || scanTime > scanCounts[tileId].lastScanned) {
//           scanCounts[tileId].lastScanned = scanTime;
//         }
//       }
//     });

//     // Step 4: Combine tile data with scan analytics
//     const analytics = tiles.map(tile => ({
//       tile_id: tile.id,
//       tile_name: tile.name || 'Unknown',
//       tile_code: tile.tileCode || tile.tile_code || 'N/A',
//       category: tile.category || 'both',
//       size: tile.size || 'N/A',
//       price: tile.price || 0,
//       stock: tile.stock || 0,
//       in_stock: tile.inStock !== undefined ? tile.inStock : true,
//       image_url: tile.imageUrl || tile.image_url || '',
//       total_scans: scanCounts[tile.id]?.count || 0,
//       last_scanned: scanCounts[tile.id]?.lastScanned || null,
//       qr_code: tile.qrCode || tile.qr_code || null
//     }));

//     // Step 5: Sort by scan count (descending)
//     analytics.sort((a, b) => b.total_scans - a.total_scans);

//     console.log('✅ Analytics calculated for', analytics.length, 'tiles');
//     return analytics;

//   } catch (error) {
//     console.error('❌ Error fetching seller scan analytics:', error);
//     return [];
//   }
// };

/**
 * Get complete seller scan analytics with stock data (FIXED v2)
 * @param sellerId - Seller's user ID
 * @returns Array of tiles with scan analytics
 */
export const getSellerScanAnalytics = async (sellerId: string): Promise<any[]> => {
  try {
    console.log('📊 Fetching scan analytics for seller:', sellerId);

    // Step 1: Get seller's tiles
    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    
    if (tilesSnapshot.empty) {
      console.log('No tiles found for seller');
      return [];
    }

    const tiles = tilesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const tileIds = tiles.map(t => t.id);
    console.log('✅ Found tiles:', tiles.length);

    // ═══════════════════════════════════════════════════════════
    // ✅ FIXED: Query with BOTH tileId AND sellerId filters
    // ═══════════════════════════════════════════════════════════
    
    let allScans: any[] = [];
    
    // Firestore 'in' query limit is 10, so batch if needed
    const batchSize = 10;
    for (let i = 0; i < tileIds.length; i += batchSize) {
      const batch = tileIds.slice(i, i + batchSize);
      
      // ✅ CRITICAL FIX: Add sellerId filter to satisfy security rules
      const scansQuery = query(
        collection(db, 'qr_scans'),
        where('sellerId', '==', sellerId),  // ← ADDED THIS
        where('tileId', 'in', batch)
      );
      
      try {
        const scansSnapshot = await getDocs(scansQuery);
        const batchScans = scansSnapshot.docs.map(doc => doc.data());
        allScans = [...allScans, ...batchScans];
      } catch (queryError: any) {
        console.warn(`⚠️ Batch query failed (this is OK if no scans yet):`, queryError.message);
        // Continue with next batch - don't fail entire function
      }
    }

    console.log('✅ Found scans:', allScans.length);

    // Step 3: Aggregate scan data per tile
    const scanCounts: { [tileId: string]: { count: number; lastScanned: string | null } } = {};
    
    allScans.forEach(scan => {
      const tileId = scan.tileId;
      
      if (!scanCounts[tileId]) {
        scanCounts[tileId] = {
          count: 0,
          lastScanned: null
        };
      }
      
      scanCounts[tileId].count++;
      
      // Track most recent scan
      const scanTime = scan.scannedAt || scan.scanned_at;
      if (scanTime) {
        if (!scanCounts[tileId].lastScanned || scanTime > scanCounts[tileId].lastScanned) {
          scanCounts[tileId].lastScanned = scanTime;
        }
      }
    });

    // Step 4: Combine tile data with scan analytics
    const analytics = tiles.map(tile => ({
      tile_id: tile.id,
      tile_name: tile.name || 'Unknown',
      tile_code: tile.tileCode || tile.tile_code || 'N/A',
      category: tile.category || 'both',
      size: tile.size || 'N/A',
      price: tile.price || 0,
      stock: tile.stock || 0,
      in_stock: tile.inStock !== undefined ? tile.inStock : true,
      image_url: tile.imageUrl || tile.image_url || '',
      total_scans: scanCounts[tile.id]?.count || 0,
      last_scanned: scanCounts[tile.id]?.lastScanned || null,
      qr_code: tile.qrCode || tile.qr_code || null
    }));

    // Step 5: Sort by scan count (descending)
    analytics.sort((a, b) => b.total_scans - a.total_scans);

    console.log('✅ Analytics calculated for', analytics.length, 'tiles');
    return analytics;

  } catch (error) {
    console.error('❌ Error fetching seller scan analytics:', error);
    return [];
  }
};

/**
 * Get top N scanned tiles for a seller
 * @param sellerId - Seller's user ID
 * @param limit - Number of top tiles to return (default 10)
 * @returns Ranked list of top scanned tiles
 */
export const getTopScannedTiles = async (
  sellerId: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    console.log(`📊 Fetching top ${limit} scanned tiles for seller:`, sellerId);

    // Get all analytics
    const analytics = await getSellerScanAnalytics(sellerId);

    if (analytics.length === 0) {
      return [];
    }

    // Already sorted by total_scans in getSellerScanAnalytics
    // Just take top N and add rank
    const topTiles = analytics
      .slice(0, limit)
      .map((tile, index) => ({
        rank: index + 1,
        ...tile,
        scan_percentage: analytics[0].total_scans > 0 
          ? Math.round((tile.total_scans / analytics[0].total_scans) * 100)
          : 0
      }));

    console.log(`✅ Top ${topTiles.length} tiles retrieved`);
    return topTiles;

  } catch (error) {
    console.error('❌ Error fetching top scanned tiles:', error);
    return [];
  }
};

/**
 * Get seller stock summary statistics
 * @param sellerId - Seller's user ID
 * @returns Stock statistics object
 */
export const getSellerStockSummary = async (sellerId: string): Promise<{
  total_stock: number;
  in_stock_count: number;
  out_stock_count: number;
  low_stock_count: number;
  total_tiles: number;
  total_scans: number;
}> => {
  try {
    console.log('📊 Calculating stock summary for seller:', sellerId);

    const analytics = await getSellerScanAnalytics(sellerId);

    if (analytics.length === 0) {
      return {
        total_stock: 0,
        in_stock_count: 0,
        out_stock_count: 0,
        low_stock_count: 0,
        total_tiles: 0,
        total_scans: 0
      };
    }

    const summary = {
      total_stock: analytics.reduce((sum, tile) => sum + (tile.stock || 0), 0),
      in_stock_count: analytics.filter(t => t.in_stock && t.stock > 0).length,
      out_stock_count: analytics.filter(t => !t.in_stock || t.stock === 0).length,
      low_stock_count: analytics.filter(t => t.in_stock && t.stock > 0 && t.stock < 10).length,
      total_tiles: analytics.length,
      total_scans: analytics.reduce((sum, tile) => sum + tile.total_scans, 0)
    };

    console.log('✅ Stock summary calculated:', summary);
    return summary;

  } catch (error) {
    console.error('❌ Error calculating stock summary:', error);
    return {
      total_stock: 0,
      in_stock_count: 0,
      out_stock_count: 0,
      low_stock_count: 0,
      total_tiles: 0,
      total_scans: 0
    };
  }
};

/**
 * Get scan timeline data for charts (last N days)
 * @param sellerId - Seller's user ID
 * @param days - Number of days to look back (default 7)
 * @returns Daily scan counts
 */
// export const getScanTimeline = async (
//   sellerId: string,
//   days: number = 7
// ): Promise<any[]> => {
//   try {
//     console.log(`📊 Fetching scan timeline for last ${days} days`);

//     // Get seller's tiles
//     const tilesQuery = query(
//       collection(db, 'tiles'),
//       where('sellerId', '==', sellerId)
//     );
//     const tilesSnapshot = await getDocs(tilesQuery);
//     const tileIds = tilesSnapshot.docs.map(doc => doc.id);

//     if (tileIds.length === 0) {
//       return [];
//     }

//     // Calculate date range
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);

//     // Get all scans
//     let allScans: any[] = [];
//     const batchSize = 10;
    
//     for (let i = 0; i < tileIds.length; i += batchSize) {
//       const batch = tileIds.slice(i, i + batchSize);
      
//       const scansQuery = query(
//         collection(db, 'qr_scans'),
//         where('tileId', 'in', batch)
//       );
      
//       const scansSnapshot = await getDocs(scansQuery);
//       const batchScans = scansSnapshot.docs.map(doc => doc.data());
//       allScans = [...allScans, ...batchScans];
//     }

//     // Group by date
//     const scansByDate: { [date: string]: number } = {};
    
//     allScans.forEach(scan => {
//       const scanTime = scan.scannedAt || scan.scanned_at;
//       if (!scanTime) return;
      
//       const scanDate = new Date(scanTime);
//       if (scanDate >= startDate && scanDate <= endDate) {
//         const dateStr = scanDate.toISOString().split('T')[0];
//         scansByDate[dateStr] = (scansByDate[dateStr] || 0) + 1;
//       }
//     });

//     // Generate timeline for all days (fill gaps with 0)
//     const timeline = [];
//     for (let i = 0; i < days; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));
//       const dateStr = date.toISOString().split('T')[0];
      
//       timeline.push({
//         date: dateStr,
//         day_name: date.toLocaleDateString('en-US', { weekday: 'short' }),
//         scans: scansByDate[dateStr] || 0
//       });
//     }

//     console.log('✅ Timeline generated for', timeline.length, 'days');
//     return timeline;

//   } catch (error) {
//     console.error('❌ Error fetching scan timeline:', error);
//     return [];
//   }
// };

/**
 * Get scan timeline data for charts (FIXED v2)
 * @param sellerId - Seller's user ID
 * @param days - Number of days to look back (default 7)
 * @returns Daily scan counts
 */
export const getScanTimeline = async (
  sellerId: string,
  days: number = 7
): Promise<any[]> => {
  try {
    console.log(`📊 Fetching scan timeline for last ${days} days`);

    // Get seller's tiles
    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tileIds = tilesSnapshot.docs.map(doc => doc.id);

    if (tileIds.length === 0) {
      console.log('No tiles found for timeline');
      return generateEmptyTimeline(days);
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ═══════════════════════════════════════════════════════════
    // ✅ FIXED: Query with BOTH filters
    // ═══════════════════════════════════════════════════════════
    
    let allScans: any[] = [];
    const batchSize = 10;
    
    for (let i = 0; i < tileIds.length; i += batchSize) {
      const batch = tileIds.slice(i, i + batchSize);
      
      // ✅ CRITICAL FIX: Add sellerId filter
      const scansQuery = query(
        collection(db, 'qr_scans'),
        where('sellerId', '==', sellerId),  // ← ADDED THIS
        where('tileId', 'in', batch)
      );
      
      try {
        const scansSnapshot = await getDocs(scansQuery);
        const batchScans = scansSnapshot.docs.map(doc => doc.data());
        allScans = [...allScans, ...batchScans];
      } catch (queryError: any) {
        console.warn(`⚠️ Timeline batch failed:`, queryError.message);
        // Continue with next batch
      }
    }

    // Group by date
    const scansByDate: { [date: string]: number } = {};
    
    allScans.forEach(scan => {
      const scanTime = scan.scannedAt || scan.scanned_at;
      if (!scanTime) return;
      
      const scanDate = new Date(scanTime);
      if (scanDate >= startDate && scanDate <= endDate) {
        const dateStr = scanDate.toISOString().split('T')[0];
        scansByDate[dateStr] = (scansByDate[dateStr] || 0) + 1;
      }
    });

    // Generate timeline for all days (fill gaps with 0)
    const timeline = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      timeline.push({
        date: dateStr,
        day_name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        scans: scansByDate[dateStr] || 0
      });
    }

    console.log('✅ Timeline generated for', timeline.length, 'days');
    return timeline;

  } catch (error) {
    console.error('❌ Error fetching scan timeline:', error);
    return generateEmptyTimeline(days);
  }
};

// ✅ Helper function for empty timeline
function generateEmptyTimeline(days: number): any[] {
  const timeline = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    timeline.push({
      date: date.toISOString().split('T')[0],
      day_name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      scans: 0
    });
  }
  return timeline;
}
/**
 * Enhanced QR scan tracking with seller analytics support
 * @param tileId - Tile ID that was scanned
 * @param sellerId - Seller ID (optional, will be fetched from tile)
 * @param scannedBy - User ID who scanned (optional)
 */
export const trackTileScanEnhanced = async (
  tileId: string,
  sellerId?: string,
  scannedBy?: string
): Promise<void> => {
  try {
    console.log('📱 Tracking QR scan for tile:', tileId);

    // Get tile data if seller ID not provided
    let finalSellerId = sellerId;
    
    if (!finalSellerId) {
      const tileDoc = await getDoc(doc(db, 'tiles', tileId));
      if (tileDoc.exists()) {
        const tileData = tileDoc.data();
        finalSellerId = tileData.sellerId || tileData.seller_id;
      }
    }

    // Create scan record
    await addDoc(collection(db, 'qr_scans'), {
      tileId: tileId,
      sellerId: finalSellerId || null,
      scannedAt: new Date().toISOString(),
      scannedBy: scannedBy || null,
      deviceType: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      userAgent: navigator.userAgent.substring(0, 200),
      sessionId: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    console.log('✅ QR scan tracked successfully');

  } catch (error) {
    console.error('❌ Error tracking QR scan:', error);
    // Don't throw - tracking should not break user flow
  }
};

// Initialize on import
if (typeof window !== 'undefined') {
  console.log('📊 Stock Analytics functions loaded');
}
export const uploadBulkTilesWithImages = async (
  tilesData: Array<{
    data: any;
    imageFile?: File;
    textureFile?: File;
  }>,
  onProgress?: (progress: number) => void
): Promise<any[]> => {
  const results: any[] = [];
  const total = tilesData.length;
  
  for (let i = 0; i < tilesData.length; i++) {
    const { data } = tilesData[i];
    
    try {
      const tile = await uploadTile(data);
      results.push(tile);
      
      if (onProgress) {
        const progress = ((i + 1) / total) * 100;
        onProgress(Math.round(progress));
      }
    } catch (error) {
      console.error(`Failed to upload tile ${i + 1}:`, error);
      throw error;
    }
  }
  
  return results;
};

// Initialize on import
if (typeof window !== 'undefined') {
  console.log('🔧 FirebaseUtils initialized - Production Ready v2.0.0 - CLEANED ✅');
}