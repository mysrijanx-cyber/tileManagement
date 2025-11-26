// src/utils/customerSession.ts
// ═══════════════════════════════════════════════════════════════
// CUSTOMER SESSION MANAGEMENT
// Purpose: Prevent repeated form fills for same customer
// ═══════════════════════════════════════════════════════════════

const SESSION_KEY = 'currentCustomer';
const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export interface CustomerSessionData {
  name: string;
  phone: string;
  address?: string;
  email?: string;
  savedAt: number;
  tileId: string;
  workerId: string;
}

// ═══════════════════════════════════════════════════════════════
// SAVE CUSTOMER TO SESSION
// ═══════════════════════════════════════════════════════════════

export const saveCustomerToSession = (data: {
  name: string;
  phone: string;
  address?: string;
  email?: string;
  tileId: string;
  workerId: string;
}): boolean => {
  try {
    const sessionData: CustomerSessionData = {
      ...data,
      savedAt: Date.now()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    console.log('✅ Customer saved to session:', {
      name: data.name,
      phone: data.phone,
      tileId: data.tileId
    });

    return true;
  } catch (error) {
    console.error('❌ Failed to save customer to session:', error);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// GET CUSTOMER FROM SESSION (WITH VALIDATION)
// ═══════════════════════════════════════════════════════════════

export const getCustomerFromSession = (): CustomerSessionData | null => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    
    if (!stored) {
      console.log('ℹ️ No customer session found');
      return null;
    }

    const data: CustomerSessionData = JSON.parse(stored);
    
    // Validate session expiry
    if (!isSessionValid(data.savedAt)) {
      console.log('⏰ Session expired, clearing...');
      clearCustomerSession();
      return null;
    }

    console.log('✅ Valid customer session found:', {
      name: data.name,
      phone: data.phone,
      age: `${Math.floor((Date.now() - data.savedAt) / 60000)} minutes`
    });

    return data;
  } catch (error) {
    console.error('❌ Failed to get customer from session:', error);
    clearCustomerSession();
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
// CHECK IF SESSION IS VALID (NOT EXPIRED)
// ═══════════════════════════════════════════════════════════════

export const isSessionValid = (savedAt?: number): boolean => {
  if (!savedAt) {
    const session = getCustomerFromSession();
    if (!session) return false;
    savedAt = session.savedAt;
  }

  const age = Date.now() - savedAt;
  const isValid = age < SESSION_EXPIRY_MS;

  if (!isValid) {
    console.log(`⏰ Session expired (${Math.floor(age / 60000)} minutes old)`);
  }

  return isValid;
};

// ═══════════════════════════════════════════════════════════════
// CLEAR CUSTOMER SESSION
// ═══════════════════════════════════════════════════════════════

export const clearCustomerSession = (): void => {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    
    if (existing) {
      const data = JSON.parse(existing);
      console.log('🗑️ Clearing customer session:', {
        name: data.name,
        phone: data.phone
      });
    }

    sessionStorage.removeItem(SESSION_KEY);
    console.log('✅ Session cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear session:', error);
    // Force clear even if parse fails
    sessionStorage.removeItem(SESSION_KEY);
  }
};

// ═══════════════════════════════════════════════════════════════
// CHECK IF SESSION EXISTS (QUICK CHECK)
// ═══════════════════════════════════════════════════════════════

export const hasActiveSession = (): boolean => {
  const session = getCustomerFromSession();
  return session !== null;
};

// ═══════════════════════════════════════════════════════════════
// GET SESSION AGE IN MINUTES
// ═══════════════════════════════════════════════════════════════

export const getSessionAge = (): number => {
  const session = getCustomerFromSession();
  if (!session) return 0;
  
  return Math.floor((Date.now() - session.savedAt) / 60000);
};

// ═══════════════════════════════════════════════════════════════
// GET REMAINING SESSION TIME
// ═══════════════════════════════════════════════════════════════

export const getRemainingSessionTime = (): number => {
  const session = getCustomerFromSession();
  if (!session) return 0;
  
  const elapsed = Date.now() - session.savedAt;
  const remaining = SESSION_EXPIRY_MS - elapsed;
  
  return Math.max(0, Math.floor(remaining / 60000)); // in minutes
};