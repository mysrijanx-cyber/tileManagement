// src/hooks/useWorkerAuthorization.ts
import { useState, useCallback } from 'react';
import { verifyWorkerTileAccess } from '../lib/firebaseutils';

interface AuthResult {
  allowed: boolean;
  error?: string;
}

export const useWorkerAuthorization = (currentUser: any) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * 🔒 CENTRALIZED WORKER AUTHORIZATION
   * Verifies if worker can access a specific tile
   * 
   * @param tileId - Tile document ID
   * @param context - Where verification is happening (for logging)
   * @returns Promise<AuthResult>
   */
  const verifyAccess = useCallback(async (
    tileId: string,
    context: string
  ): Promise<AuthResult> => {
    // ✅ Non-workers automatically allowed
    if (currentUser?.role !== 'worker' || !currentUser?.user_id) {
      console.log(`✅ [${context}] Non-worker user - access granted`);
      return { allowed: true };
    }

    setIsVerifying(true);
    console.log(`🔒 [${context}] Verifying worker access...`);
    console.log(`   Worker ID: ${currentUser.user_id}`);
    console.log(`   Tile ID: ${tileId}`);

    try {
      const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);

      if (!verification.allowed) {
        console.error(`🚫 [${context}] ACCESS DENIED:`, verification.error);

        const errorMsg = verification.error || 
          `🚫 Access Denied\n\n` +
          `This tile is not from your assigned showroom.\n\n` +
          `Workers can only use tiles from their own showroom.\n\n` +
          `Contact your manager if you believe this is an error.`;

        setAuthError(errorMsg);

        // Haptic feedback for denial
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }

        // Auto-clear error after 8 seconds
        setTimeout(() => setAuthError(null), 8000);

        setIsVerifying(false);
        return {
          allowed: false,
          error: errorMsg
        };
      }

      console.log(`✅ [${context}] Worker authorized`);
      setIsVerifying(false);
      
      // Success haptic
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      return { allowed: true };

    } catch (err: any) {
      console.error(`❌ [${context}] Verification error:`, err);
      
      const errorMsg = 'Authorization check failed. Please try again.';
      setAuthError(errorMsg);
      setTimeout(() => setAuthError(null), 5000);
      
      setIsVerifying(false);
      return {
        allowed: false,
        error: errorMsg
      };
    }
  }, [currentUser]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  return { 
    verifyAccess, 
    isVerifying, 
    authError, 
    clearError 
  };
};