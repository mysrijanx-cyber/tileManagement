import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signOut } from '../lib/firebaseutils';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const SellerAutoLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Preparing seller login...');

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        const email = searchParams.get('email');
        const password = searchParams.get('pwd');

        if (!email || !password) {
          throw new Error('Invalid login link. Missing credentials.');
        }

        console.log('🔄 Auto-login for seller:', email);
        setMessage('Logging out admin session...');

        // ✅ Step 1: Force logout admin
        try {
          await signOut();
          console.log('✅ Admin logged out');
        } catch (e) {
          console.warn('⚠️ Logout warning:', e);
        }

        // ✅ Step 2: Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // ✅ Step 3: Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage('Logging in as seller...');

        // ✅ Step 4: Login as seller
        const user = await login(email, password);
        
        if (!user) {
          throw new Error('Login failed. No user returned.');
        }

        console.log('✅ Seller logged in:', user.email);
        setStatus('success');
        setMessage('Success! Redirecting to dashboard...');

        // ✅ Step 5: Force redirect with reload
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.replace('/seller');

      } catch (error: any) {
        console.error('❌ Auto-login failed:', error);
        setStatus('error');
        setMessage(error.message || 'Auto-login failed. Please try manual login.');
      }
    };

    performAutoLogin();
  }, [searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Seller Login</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Please wait...</p>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>✓ Logging out admin session</li>
                <li>✓ Clearing cached data</li>
                <li>✓ Authenticating seller</li>
              </ul>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-green-800 mb-3">Welcome!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="animate-pulse text-blue-600">Redirecting...</div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-800 mb-3">Login Failed</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Manual Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};