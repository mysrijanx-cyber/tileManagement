import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { useAuth } from './useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useWorkerStatus = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  const { logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== 'worker') {
      return;
    }

    // Real-time listener for worker status changes
    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.user_id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          
          // If worker is disabled or deleted, logout immediately
          if (data.is_active === false || data.account_status === 'deleted') {
            console.log('🔒 Worker account disabled, logging out...');
            logout();
            alert('Your account has been disabled by the seller.');
          }
        } else {
          // User document doesn't exist - account deleted
          console.log('🔒 Worker account deleted, logging out...');
          logout();
          alert('Your account has been removed.');
        }
      },
      (error) => {
        console.error('Error listening to worker status:', error);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, currentUser, logout]);
};