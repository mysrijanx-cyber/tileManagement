

// import { initializeApp } from 'firebase/app';
// import { getAuth, Auth } from 'firebase/auth';
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; 
// // Firebase configuration interface
// interface FirebaseConfig {
//   apiKey: string;
//   authDomain: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId: string;
//   appId: string;
// }

// const firebaseConfig: FirebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize and export services with proper types
// export const auth: Auth = getAuth(app);
// export const storage = getStorage(app);
// export const db: Firestore = getFirestore(app);

// // ✅✅✅ YE NAYA CODE ADD KARO ✅✅✅
// if (typeof window !== 'undefined') {
//   console.log('🔥 Firebase Connection Info:');
//   console.log('Project ID:', app.options.projectId);
//   console.log('Auth Domain:', app.options.authDomain);
  
//   // @ts-ignore - Check Firestore host
//   const firestoreHost = db._settings?.host;
//   console.log('Firestore Host:', firestoreHost || 'firestore.googleapis.com');
  
//   // Alert if emulator detected
//   if (firestoreHost && firestoreHost.includes('localhost')) {
//     console.error('❌ EMULATOR DETECTED! Your app is connected to LOCAL emulator, not real Firebase!');
//     alert('ERROR: Firestore Emulator detected! Changes will NOT save to real database!');
//   } else {
//     console.log('✅ Connected to PRODUCTION Firebase');
//   }
// }

// export default app; 
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  clearIndexedDbPersistence,
  disableNetwork,
  enableNetwork
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const storage = getStorage(app);
export const db: Firestore = getFirestore(app);

// ✅ Export cache management functions
export { clearIndexedDbPersistence, disableNetwork, enableNetwork };

if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Connection Info:');
  console.log('Project ID:', app.options.projectId);
  console.log('Auth Domain:', app.options.authDomain);
  
  // @ts-ignore
  const firestoreHost = db._settings?.host;
  console.log('Firestore Host:', firestoreHost || 'firestore.googleapis.com');
  
  if (firestoreHost && firestoreHost.includes('localhost')) {
    console.error('❌ EMULATOR DETECTED! Your app is connected to LOCAL emulator, not real Firebase!');
    alert('ERROR: Firestore Emulator detected! Changes will NOT save to real database!');
  } else {
    console.log('✅ Connected to PRODUCTION Firebase');
  }
}

export default app;