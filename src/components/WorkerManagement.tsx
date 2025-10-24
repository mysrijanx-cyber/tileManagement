
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Key, Loader, AlertCircle, CheckCircle, 
  Copy, Trash2, RotateCcw, Power, Eye, EyeOff, X
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import {
  createWorkerAccount,
  getSellerWorker,
  resetWorkerPassword,
  toggleWorkerStatus,
  deleteWorkerAccount
} from '../lib/firebaseutils';
import { UserProfile } from '../types';

export const WorkerManagement: React.FC = () => {
  const { currentUser } = useAppStore();
  
  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  
  const [worker, setWorker] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  const [workerEmail, setWorkerEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    if (currentUser) {
      loadWorker();
    }
  }, [currentUser]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ═══════════════════════════════════════════════════════════
  // DATA LOADING
  // ═══════════════════════════════════════════════════════════

  const loadWorker = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workerData = await getSellerWorker(currentUser?.user_id || '');
      setWorker(workerData);
      
      if (workerData) {
        console.log('✅ Worker loaded:', workerData.email);
      } else {
        console.log('ℹ️ No worker found for this seller');
      }
    } catch (err: any) {
      console.error('❌ Error loading worker:', err);
      setError('Failed to load worker data');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // CREATE WORKER
  // ═══════════════════════════════════════════════════════════

  const handleCreateWorker = async () => {
    if (!workerEmail.trim()) {
      setError('Please enter worker email address');
      return;
    }

    if (!workerEmail.includes('@') || workerEmail.length < 5) {
      setError('Please enter a valid email address');
      return;
    }

    if (!currentUser?.email) {
      setError('Seller email not found. Please login again.');
      return;
    }

    const confirmed = window.confirm(
      `Create worker account for:\n\n${workerEmail}\n\n` +
      `A secure password will be auto-generated.\n` +
      `You'll need to share it with the worker.`
    );

    if (!confirmed) return;

    try {
      setCreating(true);
      setError(null);
      setSuccess(null);

      console.log('🔄 Creating worker account...');

      const result = await createWorkerAccount(
        currentUser.email,
        workerEmail.trim()
      );

      if (result.success && result.generatedPassword) {
        console.log('✅ Worker created successfully');
        
        setGeneratedPassword(result.generatedPassword);
        setShowPasswordModal(true);
        setWorkerEmail('');
        
        await loadWorker();
        
        setSuccess(
          `✅ Worker account created for ${result.workerEmail}! ` +
          `Please save the password shown in the popup.`
        );
      } else {
        throw new Error(result.error || 'Failed to create worker account');
      }
    } catch (err: any) {
      console.error('❌ Worker creation failed:', err);
      setError(err.message || 'Failed to create worker account. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RESET PASSWORD (SIMPLE VERSION)
  // ═══════════════════════════════════════════════════════════

  // const handleResetPassword = async () => {
  //   if (!worker || !currentUser?.user_id) {
  //     setError('Missing required information');
  //     return;
  //   }

  //   const confirmed = window.confirm(
  //     `Reset password for ${worker.email}?\n\n` +
  //     `Old password will stop working.\n` +
  //     `New password will be shown in popup.`
  //   );

  //   if (!confirmed) return;

  //   try {
  //     setResetting(true);
  //     setError(null);
  //     setSuccess(null);

  //     console.log('🔄 Resetting password...');

  //     const result = await resetWorkerPassword(
  //       worker.user_id,
  //       currentUser.user_id
  //     );

  //     if (result.success && result.generatedPassword) {
  //       console.log('✅ Password reset successful');

  //       setGeneratedPassword(result.generatedPassword);
  //       setShowPasswordModal(true);

  //       setSuccess(
  //         `✅ Password reset successful!\n` +
  //         `New password for ${result.workerEmail} is shown in popup.`
  //       );

  //       await loadWorker();
        
  //     } else {
  //       throw new Error(result.error || 'Reset failed');
  //     }

  //   } catch (err: any) {
  //     console.error('❌ Reset failed:', err);
      
  //     if (err.message.includes('wait 1 minute')) {
  //       setError(
  //         '⏳ Please wait 1 minute and try again.\n\n' +
  //         'Firebase needs time to process the previous deletion.'
  //       );
  //     } else {
  //       setError(err.message || 'Failed to reset password');
  //     }
      
  //   } finally {
  //     setResetting(false);
  //   }
  // };

// ═══════════════════════════════════════════════════════════
// RESET PASSWORD (PRODUCTION FIX v2.0)
// ═══════════════════════════════════════════════════════════

const handleResetPassword = async () => {
  if (!worker || !currentUser?.user_id) {
    setError('Missing required information');
    return;
  }

  const confirmed = window.confirm(
    `Reset password for ${worker.email}?\n\n` +
    `Old password will stop working immediately.\n` +
    `New password will be shown in popup.\n\n` +
    `Make sure to save the new password!`
  );

  if (!confirmed) return;

  try {
    setResetting(true);
    setError(null);
    setSuccess(null);

    // ✅ Clear any previous password data
    setGeneratedPassword(null);
    setShowPasswordModal(false);

    console.log('🔄 Resetting password for worker:', worker.user_id);

    const result = await resetWorkerPassword(
      worker.user_id,
      currentUser.user_id
    );

    console.log('📊 Reset result:', {
      success: result.success,
      hasPassword: !!result.generatedPassword,
      error: result.error
    });

    if (result.success && result.generatedPassword) {
      console.log('✅ Password reset successful');

      // ✅ PRODUCTION FIX: Set password immediately
      setGeneratedPassword(result.generatedPassword);

      // ✅ PRODUCTION FIX: Small delay to ensure state sync
      setTimeout(() => {
        setShowPasswordModal(true);
        console.log('✅ Password modal opened');
      }, 150);

      setSuccess(
        `✅ Password reset successful!\n` +
        `New password is shown in the popup. Please save it now.`
      );

      // ✅ Reload worker data after modal is closed
      setTimeout(async () => {
        await loadWorker();
      }, 1000);

    } else {
      throw new Error(result.error || 'Reset failed - no password returned');
    }

  } catch (err: any) {
    console.error('❌ Reset failed:', err);

    if (err.message.includes('wait 1 minute')) {
      setError(
        '⏳ Please wait 1 minute and try again.\n\n' +
        'Firebase needs time to process the previous action.'
      );
    } else {
      setError(err.message || 'Failed to reset password');
    }

  } finally {
    setResetting(false);
  }
};

  // ═══════════════════════════════════════════════════════════
  // TOGGLE WORKER STATUS
  // ═══════════════════════════════════════════════════════════

  const handleToggleStatus = async () => {
    if (!worker || !currentUser?.user_id) {
      setError('Missing required information');
      return;
    }

    const newStatus = !worker.is_active;
    const action = newStatus ? 'enable' : 'disable';

    const confirmed = window.confirm(
      `${action.toUpperCase()} worker account?\n\n` +
      `Worker: ${worker.email}\n` +
      `Current status: ${worker.is_active ? 'Active' : 'Disabled'}\n` +
      `New status: ${newStatus ? 'Active' : 'Disabled'}\n\n` +
      `${newStatus ? 'Worker will be able to login.' : 'Worker will be logged out immediately.'}`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);

      console.log(`🔄 ${action}ing worker...`);

      const result = await toggleWorkerStatus(
        worker.user_id,
        currentUser.user_id,
        newStatus
      );

      if (result.success) {
        console.log(`✅ Worker ${action}d successfully`);
        
        await loadWorker();
        
        setSuccess(
          `✅ Worker account ${newStatus ? 'enabled' : 'disabled'} successfully! ` +
          `${newStatus ? 'Worker can now login.' : 'Worker has been logged out.'}`
        );
      } else {
        throw new Error(result.error || `Failed to ${action} worker`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to ${action} worker:`, err);
      setError(err.message || `Failed to ${action} worker account`);
    } finally {
      setActionLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // DELETE WORKER
  // ═══════════════════════════════════════════════════════════

  // const handleDeleteWorker = async () => {
  //   if (!worker || !currentUser?.user_id) {
  //     setError('Missing required information');
  //     return;
  //   }

  //   const firstConfirm = window.confirm(
  //     `⚠️ DELETE WORKER ACCOUNT?\n\n` +
  //     `Worker: ${worker.email}\n\n` +
  //     `This action will:\n` +
  //     `• Delete worker account permanently\n` +
  //     `• Log out worker immediately\n` +
  //     `• Remove all access\n\n` +
  //     `This CANNOT be undone!\n\n` +
  //     `Continue?`
  //   );

  //   if (!firstConfirm) return;

  //   const confirmation = window.prompt(
  //     `⚠️ FINAL CONFIRMATION\n\n` +
  //     `Type "DELETE" (all caps) to confirm deletion of:\n` +
  //     `${worker.email}`
  //   );

  //   if (confirmation !== 'DELETE') {
  //     setError('Deletion cancelled - confirmation text did not match');
  //     return;
  //   }

  //   try {
  //     setActionLoading(true);
  //     setError(null);
  //     setSuccess(null);

  //     console.log('🔄 Deleting worker account...');

  //     const result = await deleteWorkerAccount(
  //       worker.user_id,
  //       currentUser.user_id
  //     );

  //     if (result.success) {
  //       console.log('✅ Worker deleted successfully');
        
  //       setWorker(null);
        
  //       setSuccess(
  //         `✅ Worker account (${worker.email}) deleted successfully! ` +
  //         `You can now create a new worker.`
  //       );
  //     } else {
  //       throw new Error(result.error || 'Failed to delete worker');
  //     }
  //   } catch (err: any) {
  //     console.error('❌ Worker deletion failed:', err);
  //     setError(err.message || 'Failed to delete worker account');
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };
// ═══════════════════════════════════════════════════════════
// DELETE WORKER (PRODUCTION FIX v2.0)
// ═══════════════════════════════════════════════════════════

const handleDeleteWorker = async () => {
  if (!worker || !currentUser?.user_id) {
    setError('Missing required information');
    return;
  }

  const firstConfirm = window.confirm(
    `⚠️ DELETE WORKER ACCOUNT?\n\n` +
    `Worker: ${worker.email}\n\n` +
    `This action will:\n` +
    `• Delete worker account permanently\n` +
    `• Log out worker immediately\n` +
    `• Remove all access\n\n` +
    `This CANNOT be undone!\n\n` +
    `Continue?`
  );

  if (!firstConfirm) return;

  const confirmation = window.prompt(
    `⚠️ FINAL CONFIRMATION\n\n` +
    `Type "DELETE" (all caps) to confirm deletion of:\n` +
    `${worker.email}`
  );

  if (confirmation !== 'DELETE') {
    setError('Deletion cancelled - confirmation text did not match');
    return;
  }

  try {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    console.log('🔄 Deleting worker account:', worker.user_id);

    const result = await deleteWorkerAccount(
      worker.user_id,
      currentUser.user_id
    );

    if (result.success) {
      console.log('✅ Worker deleted successfully');

      // ✅ PRODUCTION FIX: Clear local state immediately
      const deletedEmail = worker.email;
      setWorker(null);

      // ✅ PRODUCTION FIX: Reload from database to confirm deletion
      setTimeout(async () => {
        await loadWorker();
        console.log('✅ Worker data reloaded after deletion');
      }, 500);

      setSuccess(
        `✅ Worker account (${deletedEmail}) deleted successfully!\n\n` +
        `You can now create a new worker.`
      );

    } else {
      throw new Error(result.error || 'Failed to delete worker');
    }

  } catch (err: any) {
    console.error('❌ Worker deletion failed:', err);
    setError(err.message || 'Failed to delete worker account');

  } finally {
    setActionLoading(false);
  }
};

  // ═══════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('✅ Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    }
  };

  const shareViaWhatsApp = (password: string) => {
    const message = 
      `🔐 Your Worker Login Credentials\n\n` +
      `Email: ${worker?.email || workerEmail}\n` +
      `Password: ${password}\n\n` +
      `⚠️ Keep this secure.`;
    
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`, 
      '_blank'
    );
  };

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-gray-600">Loading worker management...</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <User className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Worker Management
            </h3>
            <p className="text-blue-700 mb-4">
              Create a worker account with auto-generated secure password. 
              Worker can only access the scan page.
            </p>
            <div className="bg-white/60 rounded-lg p-3 text-sm">
              <p className="text-blue-900 font-medium mb-2">📋 How it works:</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Enter worker's email and create account</li>
                <li>• Password is auto-generated (12 characters, secure)</li>
                <li>• Share credentials with your worker via WhatsApp/copy</li>
                <li>• Worker logs in and gets scan page access only</li>
                <li>• You can reset password, disable, or delete anytime</li>
                <li>• Only ONE worker allowed per seller</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm whitespace-pre-line">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)} 
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* CREATE WORKER FORM */}
      {!worker ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Create Worker Account
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Worker Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="worker@example.com"
                  value={workerEmail}
                  onChange={(e) => setWorkerEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && workerEmail.trim()) {
                      handleCreateWorker();
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={creating}
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                🔐 Password will be auto-generated and shown once after creation
              </p>
            </div>

            <button
              onClick={handleCreateWorker}
              disabled={creating || !workerEmail.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {creating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Worker Account...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Create Worker Account
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Important:</strong> You can only have ONE worker at a time. 
              Delete the existing worker to create a new one.
            </p>
          </div>
        </div>
      ) : (
        
        /* WORKER DETAILS CARD */
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Worker Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Active Worker Account
                </h4>
                <p className="text-sm text-gray-500">
                  Created {new Date(worker.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              worker.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                worker.is_active ? 'bg-green-600' : 'bg-red-600'
              }`} />
              {worker.is_active ? 'Active' : 'Disabled'}
            </div>
          </div>

          {/* Worker Details */}
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-xs font-medium text-gray-600 block mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="flex items-center justify-between gap-2">
                <p className="text-gray-900 font-medium">{worker.email}</p>
                <button
                  onClick={() => copyToClipboard(worker.email)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Copy email"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-600 block mb-1.5 uppercase tracking-wide">
                  Role
                </label>
                <p className="text-gray-900 font-medium capitalize">{worker.role}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-600 block mb-1.5 uppercase tracking-wide">
                  Account Status
                </label>
                <p className="text-gray-900 font-medium capitalize">
                  {worker.account_status || 'Active'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Reset Password Button */}
              <button
                onClick={handleResetPassword}
                disabled={resetting || actionLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
              >
                {resetting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Enable/Disable Button */}
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading || resetting}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  worker.is_active
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    {worker.is_active ? 'Disable Account' : 'Enable Account'}
                  </>
                )}
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDeleteWorker}
              disabled={actionLoading || resetting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Delete Worker Permanently
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>ℹ️ Password Reset:</strong> Click "Reset Password" to generate a new password. 
              The new password will be shown only once in a popup. Make sure to save it!
            </p>
          </div>
        </div>
      )}

      {/* PASSWORD DISPLAY MODAL */}
      {showPasswordModal && generatedPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Key className="w-6 h-6 text-green-600" />
                Worker Credentials
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setGeneratedPassword(null);
                  setShowPassword(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ <strong>SAVE NOW!</strong> This password won't be shown again. 
                Copy it or share via WhatsApp before closing.
              </p>
            </div>

            {/* Credentials */}
            <div className="space-y-3 mb-6">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-600 block mb-2 uppercase tracking-wide">
                  Worker Email
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-900 font-mono text-sm break-all">
                    {worker?.email || workerEmail}
                  </p>
                  <button
                    onClick={() => copyToClipboard(worker?.email || workerEmail)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    title="Copy email"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-600 block mb-2 uppercase tracking-wide">
                  Generated Password
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-900 font-mono text-base font-bold break-all flex-1">
                    {showPassword ? generatedPassword : '••••••••••••'}
                  </p>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-white/60 rounded transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(generatedPassword)}
                      className="p-2 hover:bg-white/60 rounded transition-colors"
                      title="Copy password"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyToClipboard(
                    `Worker Login:\n\nEmail: ${worker?.email || workerEmail}\nPassword: ${generatedPassword}\n\nKeep this secure!`
                  )}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Copy className="w-4 h-4" />
                  Copy Both
                </button>
                <button
                  onClick={() => shareViaWhatsApp(generatedPassword)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  📱 WhatsApp
                </button>
              </div>

              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    'Have you saved the password?\n\n' +
                    'You won\'t be able to see it again.\n\n' +
                    'Click OK only if you\'ve copied or shared the password.'
                  );
                  
                  if (confirmed) {
                    setShowPasswordModal(false);
                    setGeneratedPassword(null);
                    setShowPassword(false);
                  }
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ✓ Done - I've Saved the Credentials
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-xs">
                📋 <strong>Next Steps:</strong> Share these credentials with your worker. 
                They can login at the same login page you use. 
                Workers only see the scan page after login.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};