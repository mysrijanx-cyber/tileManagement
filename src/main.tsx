// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

// src/main.tsx - PRODUCTION READY
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

// ✅ PRODUCTION: Strict Mode disabled to prevent duplicate effects
// StrictMode causes components to mount twice in development
// which leads to duplicate QR scan tracking

if (process.env.NODE_ENV === 'development') {
  // Development mode - without StrictMode for accurate tracking
  console.log('🔧 Running in DEVELOPMENT mode (StrictMode disabled for tracking accuracy)');
  root.render(<App />);
} else {
  // Production mode - StrictMode not needed
  console.log('🚀 Running in PRODUCTION mode');
  root.render(<App />);
}

// Optional: Enable StrictMode for testing other features
// Uncomment below if you want to test with StrictMode
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );