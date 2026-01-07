
// import React, { useState, useEffect } from 'react';
// import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User, Loader2 } from 'lucide-react';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../lib/firebase';

// interface FormData {
//   businessName: string;
//   ownerName: string;
//   email: string;
//   phone: string;
//   businessAddress: string;
//   additionalInfo: string;
// }

// export const SellerRequestForm: React.FC = () => {
//   // ✅ FORM DATA
//   const [formData, setFormData] = useState<FormData>({
//     businessName: '',
//     ownerName: '',
//     email: '',
//     phone: '',
//     businessAddress: '',
//     additionalInfo: ''
//   });
  
//   // ✅ SUBMISSION STATES
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState('');
  
//   // ✅ VALIDATION ERRORS
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [nameError, setNameError] = useState('');

//   // ✅ EMAIL CHECK STATES (ADMIN PATTERN)
//   const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
//   const [emailExists, setEmailExists] = useState<boolean>(false);
//   const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');

//   // ✅ EMAIL VALIDATION (ADMIN PATTERN)
//   const validateEmail = (email: string): boolean => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   // ✅ PHONE VALIDATION
//   const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
//     const cleaned = phone.replace(/\D/g, '');
    
//     if (!cleaned) {
//       return { isValid: false, error: 'Phone number is required' };
//     }
    
//     if (cleaned.length !== 10) {
//       return { isValid: false, error: 'Phone must be exactly 10 digits' };
//     }
    
//     if (!/^[6-9]/.test(cleaned)) {
//       return { isValid: false, error: 'Phone must start with 6, 7, 8, or 9' };
//     }
    
//     return { isValid: true };
//   };

//   // ✅ NAME VALIDATION
//   const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
//     if (!name.trim()) {
//       return { isValid: false, error: 'Owner name is required' };
//     }
    
//     if (name.trim().length < 2) {
//       return { isValid: false, error: 'Name must be at least 2 characters' };
//     }
    
//     if (/\d/.test(name)) {
//       return { isValid: false, error: 'Name cannot contain numbers' };
//     }
    
//     if (!/^[a-zA-Z\s]+$/.test(name)) {
//       return { isValid: false, error: 'Name can only contain letters and spaces' };
//     }
    
//     return { isValid: true };
//   };

//   // ✅ CHECK EMAIL IN DATABASE (ADMIN PATTERN - WORKING)
//   const checkEmailExists = async (email: string): Promise<void> => {
//     console.log('🔍 [EMAIL CHECK] Starting for:', email);

//     if (!email || !validateEmail(email)) {
//       console.log('⏭️ [EMAIL CHECK] Skipped - invalid format');
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       return;
//     }

//     if (email.length < 5) {
//       console.log('⏭️ [EMAIL CHECK] Skipped - too short');
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       return;
//     }

//     setCheckingEmail(true);
//     setEmailCheckMessage('🔍 Checking database...');
//     console.log('⏳ [EMAIL CHECK] Checking database...');

//     try {
//       const emailToCheck = email.toLowerCase().trim();
//       console.log('📧 [EMAIL CHECK] Normalized:', emailToCheck);

//       // CHECK 1: Sellers collection
//       console.log('1️⃣ Checking sellers...');
//       const sellersQuery = query(
//         collection(db, 'sellers'),
//         where('email', '==', emailToCheck)
//       );
//       const sellersSnapshot = await getDocs(sellersQuery);
//       console.log('✅ Sellers check done. Found:', sellersSnapshot.size);

//       if (sellersSnapshot.size > 0) {
//         console.log('❌ Email EXISTS in sellers');
//         setEmailExists(true);
//         setEmailCheckMessage('❌ Email found in database - Already registered as seller');
//         setEmailError('This email is already in use');
//         setCheckingEmail(false);
//         return;
//       }

//       // CHECK 2: Users collection
//       console.log('2️⃣ Checking users...');
//       try {
//         const usersQuery = query(
//           collection(db, 'users'),
//           where('email', '==', emailToCheck)
//         );
//         const usersSnapshot = await getDocs(usersQuery);
//         console.log('✅ Users check done. Found:', usersSnapshot.size);

//         if (usersSnapshot.size > 0) {
//           console.log('❌ Email EXISTS in users');
//           setEmailExists(true);
//           setEmailCheckMessage('❌ Email found in database - Already registered');
//           setEmailError('This email is already in use');
//           setCheckingEmail(false);
//           return;
//         }
//       } catch (userError) {
//         console.log('⚠️ Users check skipped');
//       }

//       // CHECK 3: Seller Requests
//       console.log('3️⃣ Checking seller requests...');
//       try {
//         const requestsQuery = query(
//           collection(db, 'sellerRequests'),
//           where('email', '==', emailToCheck)
//         );
//         const requestsSnapshot = await getDocs(requestsQuery);
//         console.log('✅ Requests check done. Found:', requestsSnapshot.size);

//         if (requestsSnapshot.size > 0) {
//           const existingRequest = requestsSnapshot.docs[0].data();
//           const status = existingRequest.status;
//           console.log('📋 Existing request status:', status);

//           if (status === 'pending') {
//             console.log('⏳ Email has PENDING request');
//             setEmailExists(true);
//             setEmailCheckMessage('⏳ Request already submitted with this email');
//             setEmailError('A request with this email is pending');
//             setCheckingEmail(false);
//             return;
//           } else if (status === 'approved') {
//             console.log('✅ Email APPROVED');
//             setEmailExists(true);
//             setEmailCheckMessage('✅ Email already approved - Account exists');
//             setEmailError('This email already has an account');
//             setCheckingEmail(false);
//             return;
//           } else if (status === 'rejected') {
//             console.log('❌ Previous request REJECTED - can reapply');
//             setEmailExists(false);
//             setEmailCheckMessage('⚠️ Previous request rejected - You can reapply');
//             setEmailError('');
//             setCheckingEmail(false);
//             return;
//           }
//         }
//       } catch (requestError) {
//         console.log('⚠️ Requests check skipped');
//       }

//       // EMAIL AVAILABLE
//       console.log('✅ Email AVAILABLE');
//       setEmailExists(false);
//       setEmailCheckMessage('✅ Email not registered - You can submit request');
//       setEmailError('');

//     } catch (error) {
//       console.error('❌ [EMAIL CHECK] Error:', error);
//       setEmailCheckMessage('⚠️ Could not verify email - Please try again');
//       setEmailExists(false);
//     } finally {
//       setCheckingEmail(false);
//       console.log('🏁 [EMAIL CHECK] Completed');
//     }
//   };

  
//   // ✅ DEBOUNCED EMAIL CHECK (ADMIN PATTERN)
//   useEffect(() => {
//     console.log('🔄 [EFFECT] Email changed:', formData.email);

//     if (!formData.email) {
//       console.log('⏭️ [EFFECT] Email empty - reset');
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       setEmailError('');
//       return;
//     }

//     if (!validateEmail(formData.email)) {
//       console.log('⏭️ [EFFECT] Invalid format - skip');
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       return;
//     }

//     console.log('⏰ [EFFECT] Setting 500ms timer...');
//     const timer = setTimeout(() => {
//       console.log('⏰ [EFFECT] Timer fired! Checking email...');
//       checkEmailExists(formData.email);
//     }, 500);

//     return () => {
//       console.log('🧹 [EFFECT] Cleanup timer');
//       clearTimeout(timer);
//     };
//   }, [formData.email]);

//   // ✅ INPUT CHANGE HANDLER
//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     if (error) setError('');
    
//     if (field === 'email') {
//       setEmailCheckMessage('');
//       setEmailExists(false);
//       if (emailError) setEmailError('');
//     }
    
//     if (field === 'phone') {
//       if (phoneError) setPhoneError('');
//       if (value) {
//         const validation = validatePhone(value);
//         if (!validation.isValid) {
//           setPhoneError(validation.error || 'Invalid phone');
//         }
//       }
//     }
    
//     if (field === 'ownerName') {
//       if (nameError) setNameError('');
//       if (value) {
//         const validation = validateOwnerName(value);
//         if (!validation.isValid) {
//           setNameError(validation.error || 'Invalid name');
//         }
//       }
//     }
//   };

//   // ✅ FORM VALIDATION
//   const validateForm = (): boolean => {
//     if (!formData.businessName.trim()) {
//       setError('Business name is required');
//       return false;
//     }
    
//     const nameValidation = validateOwnerName(formData.ownerName);
//     if (!nameValidation.isValid) {
//       setNameError(nameValidation.error || 'Invalid name');
//       return false;
//     }
    
//     if (!validateEmail(formData.email)) {
//       setEmailError('Please enter a valid email');
//       return false;
//     }

//     if (emailExists) {
//       setError('Cannot submit - Email already registered');
//       return false;
//     }
    
//     const phoneValidation = validatePhone(formData.phone);
//     if (!phoneValidation.isValid) {
//       setPhoneError(phoneValidation.error || 'Invalid phone');
//       return false;
//     }
    
//     if (!formData.businessAddress.trim()) {
//       setError('Business address is required');
//       return false;
//     }
    
//     return true;
//   };

//   // ✅ FORM SUBMIT
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     console.log('📝 [SUBMIT] Form submit triggered');

//     if (emailExists) {
//       console.log('❌ [SUBMIT] Blocked - email exists');
//       alert('❌ Cannot Submit!\n\nThis email is already registered or has a pending request.');
//       return;
//     }

//     if (checkingEmail) {
//       console.log('⏳ [SUBMIT] Blocked - still checking email');
//       alert('⏳ Please wait...\n\nEmail verification in progress.');
//       return;
//     }
    
//     if (!validateForm()) {
//       console.log('❌ [SUBMIT] Validation failed');
//       return;
//     }
    
//     setSubmitting(true);
//     setError('');

//     try {
//       console.log('📤 [SUBMIT] Submitting to Firestore...');

//       const docRef = await addDoc(collection(db, 'sellerRequests'), {
//         businessName: formData.businessName.trim(),
//         ownerName: formData.ownerName.trim(),
//         email: formData.email.toLowerCase().trim(),
//         phone: formData.phone.replace(/\D/g, ''),
//         businessAddress: formData.businessAddress.trim(),
//         additionalInfo: formData.additionalInfo.trim() || null,
//         status: 'pending',
//         requestedAt: new Date().toISOString(),
//         adminNotes: null,
//         reviewedAt: null,
//         reviewedBy: null,
//         emailDeliveryStatus: null,
//         accountCreated: false
//       });

//       console.log('✅ [SUBMIT] Success! ID:', docRef.id);
//       setSubmitted(true);
      
//     } catch (error: any) {
//       console.error('❌ [SUBMIT] Error:', error);
      
//       if (error.code === 'permission-denied') {
//         setError('Permission denied. Please contact support.');
//       } else {
//         setError('Failed to submit. Please try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ✅ SUCCESS SCREEN
//   if (submitted) {
//     return (
//       <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 md:p-8 text-center mx-auto max-w-full">
//         <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600 mx-auto mb-3 sm:mb-4" />
//         <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-green-800 mb-2 px-2">
//           Request Submitted Successfully!
//         </h3>
//         <p className="text-sm sm:text-base text-green-700 mb-4 px-2">
//           Thank you <strong className="break-words">{formData.ownerName}</strong> for your interest in joining our platform.
//         </p>
//         <div className="bg-white rounded-lg p-3 sm:p-4 text-left max-w-md mx-auto">
//           <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📋 What happens next?</h4>
//           <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
//             <li>• Our team will review your application</li>
//             <li>• Verification process: 2-3 business days</li>
//             <li className="break-all">• You'll receive email updates at: <strong>{formData.email}</strong></li>
//             <li>• If approved, you'll get login credentials immediately</li>
//           </ul>
//         </div>
//         <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
//           Reference ID: REQ-{Date.now().toString().slice(-6)}
//         </p>
//       </div>
//     );
//   }

//   // ✅ FORM UI
//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-full">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-5 md:p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//           <Store className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0" />
//           <div className="w-full sm:w-auto">
//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
//               Become a Seller Partner
//             </h2>
//             <p className="text-xs sm:text-sm md:text-base text-blue-100 mt-1">
//               Join our platform and showcase your tiles to more customers
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
//         {/* Global Error */}
//         {error && (
//           <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2">
//             <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
//             <span className="text-red-700 text-xs sm:text-sm">{error}</span>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//           {/* Business Name */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//               <Store className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
//               Business Name *
//             </label>
//             <input
//               type="text"
//               value={formData.businessName}
//               onChange={(e) => handleInputChange('businessName', e.target.value)}
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="e.g. ABC Tiles & Ceramics"
//               required
//             />
//           </div>

//           {/* Owner Name */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//               <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
//               Owner Name *
//             </label>
//             <input
//               type="text"
//               value={formData.ownerName}
//               onChange={(e) => handleInputChange('ownerName', e.target.value)}
//               className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
//                 nameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="e.g. John Doe"
//               required
//             />
//             {nameError && (
//               <p className="text-red-600 text-xs mt-1">⚠️ {nameError}</p>
//             )}
//           </div>

//           {/* ✅ EMAIL WITH CHECK (ADMIN PATTERN) */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//               <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
//               Business Email * 
//               <span className="block sm:inline text-xs text-gray-500 mt-0.5 sm:mt-0 sm:ml-1">
//                 (Login credentials will be sent here)
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange('email', e.target.value)}
//                 className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 transition-colors ${
//                   checkingEmail 
//                     ? 'border-blue-500 focus:ring-blue-500' 
//                     : emailExists 
//                     ? 'border-red-500 focus:ring-red-500 bg-red-50' 
//                     : emailCheckMessage && !emailExists && !emailError
//                     ? 'border-green-500 focus:ring-green-500 bg-green-50'
//                     : emailError 
//                     ? 'border-red-300 bg-red-50 focus:ring-red-500' 
//                     : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//                 placeholder="business@yourcompany.com"
//                 required
//               />
              
//               {/* Status Icon */}
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 {checkingEmail && (
//                   <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
//                 )}
//                 {!checkingEmail && emailCheckMessage && !emailExists && !emailError && (
//                   <span className="text-green-600 text-xl font-bold">✓</span>
//                 )}
//                 {!checkingEmail && emailExists && (
//                   <span className="text-red-600 text-xl font-bold">✕</span>
//                 )}
//               </div>
//             </div>
            
//             {/* Format Error */}
//             {emailError && !checkingEmail && !emailCheckMessage && (
//               <p className="text-red-600 text-xs mt-1">⚠️ {emailError}</p>
//             )}
            
//             {/* Check Message */}
//             {emailCheckMessage && (
//               <div className={`mt-2 p-2 rounded-lg text-xs ${
//                 checkingEmail ? 'bg-blue-50 border border-blue-200' :
//                 emailExists ? 'bg-red-50 border border-red-200' : 
//                 'bg-green-50 border border-green-200'
//               }`}>
//                 <p className={`font-medium ${
//                   checkingEmail ? 'text-blue-700' :
//                   emailExists ? 'text-red-700' : 
//                   'text-green-700'
//                 }`}>
//                   {emailCheckMessage}
//                 </p>
//                 {emailExists && (
//                   <p className="text-red-600 mt-1">
//                     💡 Please use a different email or contact support.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//               <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               value={formData.phone}
//               onChange={(e) => handleInputChange('phone', e.target.value)}
//               className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
//                 phoneError ? 'border-red-300 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="9876543210"
//               maxLength={10}
//               required
//             />
//             {phoneError && (
//               <p className="text-red-600 text-xs mt-1">⚠️ {phoneError}</p>
//             )}
//           </div>
//         </div>
        
//         {/* Address */}
//         <div>
//           <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//             <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
//             Business Address *
//           </label>
//           <textarea
//             value={formData.businessAddress}
//             onChange={(e) => handleInputChange('businessAddress', e.target.value)}
//             className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//             rows={3}
//             placeholder="Complete business address with city, state, pincode"
//             required
//           />
//         </div>
        
//         {/* Additional Info */}
//         <div>
//           <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//             Tell us about your tile business (optional)
//           </label>
//           <textarea
//             value={formData.additionalInfo}
//             onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
//             className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//             rows={3}
//             placeholder="Years in business, specialties, customer base, etc."
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={
//             submitting || 
//             checkingEmail || 
//             emailExists || 
//             !!emailError || 
//             !!phoneError || 
//             !!nameError
//           }
//           className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 sm:py-3.5 md:py-4 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
//         >
//           {submitting ? (
//             <>
//               <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//               <span className="text-sm sm:text-base md:text-lg">Submitting Request...</span>
//             </>
//           ) : checkingEmail ? (
//             <>
//               <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//               <span className="text-sm sm:text-base md:text-lg">Verifying Email...</span>
//             </>
//           ) : emailExists ? (
//             <span className="text-sm sm:text-base md:text-lg">❌ Cannot Submit - Email Already Registered</span>
//           ) : (
//             <>
//               <Send className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="text-sm sm:text-base md:text-lg">Submit Seller Request</span>
//             </>
//           )}
//         </button>

//         {/* Status Footer */}
//         <div className="text-center text-xs sm:text-sm font-medium">
//           {checkingEmail && (
//             <p className="text-blue-600">🔍 Verifying email availability in database...</p>
//           )}
          
//           {emailExists && !checkingEmail && (
//             <p className="text-red-600">
//               ❌ This email is already registered. Request cannot be submitted.
//             </p>
//           )}
          
//           {!emailExists && emailCheckMessage && !checkingEmail && !emailError && (
//             <p className="text-green-600">
//               ✅ Email verified - Not registered in database. You can proceed.
//             </p>
//           )}
//         </div>

//         {/* Help Text */}
//         <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
//           <p className="font-medium text-gray-800 mb-2 text-sm sm:text-base">✨ Why join our platform?</p>
//           <ul className="space-y-1 sm:space-y-1.5">
//             <li>• Reach customers with 3D tile visualization</li>
//             <li>• Analytics to track tile performance</li>
//             <li>• Easy inventory management</li>
//             <li>• QR code integration for physical stores</li>
//             <li>• Professional seller dashboard</li>
//           </ul>
//         </div>
//       </form>
//     </div>
//   );
// };  

import React, { useState, useEffect, useRef } from 'react';
import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User, Loader2, RefreshCw } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  additionalInfo: string;
}

export const SellerRequestForm: React.FC = () => {
  // 📝 FORM DATA (with localStorage persistence)
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('sellerRequestDraft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          businessAddress: '',
          additionalInfo: ''
        };
      }
    }
    return {
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      businessAddress: '',
      additionalInfo: ''
    };
  });
  
  // 🔄 SUBMISSION STATES
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // ⚠️ FIELD VALIDATION ERRORS
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [domainSuggestion, setDomainSuggestion] = useState('');

  // 🔍 EMAIL CHECK STATES
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');
  
  // 📱 PHONE CHECK STATES
  const [checkingPhone, setCheckingPhone] = useState<boolean>(false);
  const [phoneExists, setPhoneExists] = useState<boolean>(false);
  const [phoneCheckMessage, setPhoneCheckMessage] = useState<string>('');

  // 🏢 BUSINESS NAME CHECK STATES
  const [checkingBusinessName, setCheckingBusinessName] = useState<boolean>(false);
  const [businessNameExists, setBusinessNameExists] = useState<boolean>(false);
  const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState<string>('');
  
  // 🛡️ RACE CONDITION PREVENTION
  const lastCheckedEmail = useRef<string>('');
  const lastCheckedPhone = useRef<string>('');
  const lastCheckedBusinessName = useRef<string>('');
  const checkInProgress = useRef<boolean>(false);
  
  // 🚫 RATE LIMITING
  const lastSubmitTime = useRef<number>(0);
  const SUBMIT_COOLDOWN = 5000;

  // 💾 SAVE FORM DATA
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
    }
  }, [formData, submitted]);

  // 🧹 CLEAR DRAFT ON SUCCESS
  useEffect(() => {
    if (submitted) {
      localStorage.removeItem('sellerRequestDraft');
    }
  }, [submitted]);

  // ✅ STRICT EMAIL FORMAT VALIDATION (FIXED)
  const validateEmail = (email: string): boolean => {
    // Must contain @ and proper domain
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!regex.test(email)) {
      return false;
    }
    
    // Additional checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    if (parts[0].length === 0) return false; // No username
    if (parts[1].length === 0) return false; // No domain
    if (!parts[1].includes('.')) return false; // No TLD
    
    return true;
  };

  // 🔧 EMAIL DOMAIN TYPO DETECTION (STRICT - BLOCKS SUBMISSION)
  const validateEmailDomain = (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
    const commonTypos: Record<string, string> = {
      'gmali.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmaol.com': 'gmail.com',
      'gnail.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'yahho.com': 'yahoo.com',
      'yahhoo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmali.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com',
      'outluk.com': 'outlook.com'
    };
    
    const parts = email.split('@');
    if (parts.length !== 2) {
      return { isValid: false, hasTypo: false };
    }
    
    const domain = parts[1]?.toLowerCase();
    if (!domain) {
      return { isValid: false, hasTypo: false };
    }
    
    // ❌ TYPO DETECTED - BLOCK SUBMISSION
    if (commonTypos[domain]) {
      const suggestion = parts[0] + '@' + commonTypos[domain];
      return { isValid: false, suggestion, hasTypo: true };
    }
    
    return { isValid: true, hasTypo: false };
  };

  // 📱 PHONE VALIDATION
  const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!cleaned) {
      return { isValid: false, error: 'Phone number required' };
    }
    
    if (cleaned.length !== 10) {
      return { isValid: false, error: 'Must be exactly 10 digits' };
    }
    
    if (!/^[6-9]/.test(cleaned)) {
      return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
    }
    
    return { isValid: true };
  };

  // 👤 NAME VALIDATION
  const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'Owner name required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'At least 2 characters required' };
    }
    
    if (/\d/.test(name)) {
      return { isValid: false, error: 'Cannot contain numbers' };
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, error: 'Only letters and spaces allowed' };
    }
    
    return { isValid: true };
  };

  // 🏢 BUSINESS NAME VALIDATION
  const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'Business name required' };
    }
    
    if (name.trim().length < 3) {
      return { isValid: false, error: 'At least 3 characters required' };
    }
    
    if (name.trim().length > 100) {
      return { isValid: false, error: 'Maximum 100 characters allowed' };
    }
    
    return { isValid: true };
  };

  // 🔍 CHECK EMAIL IN DATABASE
  const checkEmailExists = async (email: string): Promise<boolean> => {
    console.log('🔍 Checking email:', email);

    if (checkInProgress.current) {
      console.log('⏭️ Check in progress');
      return emailExists;
    }

    // STRICT VALIDATION
    if (!email || !validateEmail(email)) {
      console.log('❌ Invalid email format');
      return false;
    }

    // CHECK FOR TYPOS - BLOCK IF FOUND
    const domainCheck = validateEmailDomain(email);
    if (domainCheck.hasTypo && domainCheck.suggestion) {
      console.log('❌ Email typo detected:', email, '→', domainCheck.suggestion);
      setDomainSuggestion(domainCheck.suggestion);
      setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
      setEmailExists(false);
      setEmailCheckMessage('❌ Invalid domain - Fix typo');
      return false;
    } else {
      setDomainSuggestion('');
    }

    checkInProgress.current = true;
    setCheckingEmail(true);
    setEmailCheckMessage('🔍 Checking...');

    try {
      const emailToCheck = email.toLowerCase().trim();

      // Check sellers
      const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      if (sellersSnapshot.size > 0) {
        setEmailExists(true);
        setEmailCheckMessage('❌ Already registered as seller');
        setEmailError('Email already registered');
        setCheckingEmail(false);
        checkInProgress.current = false;
        lastCheckedEmail.current = emailToCheck;
        return true;
      }

      // Check users
      try {
        const usersQuery = query(collection(db, 'users'), where('email', '==', emailToCheck));
        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.size > 0) {
          setEmailExists(true);
          setEmailCheckMessage('❌ Already registered');
          setEmailError('Email already in use');
          setCheckingEmail(false);
          checkInProgress.current = false;
          lastCheckedEmail.current = emailToCheck;
          return true;
        }
      } catch (err) {
        console.log('⚠️ Users check skipped');
      }

      // Check seller requests
      try {
        const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
        const requestsSnapshot = await getDocs(requestsQuery);
        
        if (requestsSnapshot.size > 0) {
          const status = requestsSnapshot.docs[0].data().status;
          
          if (status === 'pending') {
            setEmailExists(true);
            setEmailCheckMessage('⏳ Request pending');
            setEmailError('Request already pending');
            setCheckingEmail(false);
            checkInProgress.current = false;
            lastCheckedEmail.current = emailToCheck;
            return true;
          } else if (status === 'approved') {
            setEmailExists(true);
            setEmailCheckMessage('✅ Already approved');
            setEmailError('Account already exists');
            setCheckingEmail(false);
            checkInProgress.current = false;
            lastCheckedEmail.current = emailToCheck;
            return true;
          } else if (status === 'rejected') {
            setEmailExists(false);
            setEmailCheckMessage('⚠️ Can reapply');
            setEmailError('');
            setCheckingEmail(false);
            checkInProgress.current = false;
            lastCheckedEmail.current = emailToCheck;
            return false;
          }
        }
      } catch (err) {
        console.log('⚠️ Requests check skipped');
      }

      setEmailExists(false);
      setEmailCheckMessage('✅ Available');
      setEmailError('');
      setCheckingEmail(false);
      checkInProgress.current = false;
      lastCheckedEmail.current = emailToCheck;
      return false;

    } catch (error) {
      console.error('❌ Email check error:', error);
      setEmailCheckMessage('⚠️ Check failed');
      setEmailExists(false);
      setCheckingEmail(false);
      checkInProgress.current = false;
      return false;
    }
  };

  // 📱 CHECK PHONE IN DATABASE
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!cleaned || cleaned.length !== 10) {
      return false;
    }

    if (lastCheckedPhone.current === cleaned) {
      return phoneExists;
    }

    setCheckingPhone(true);
    setPhoneCheckMessage('🔍 Checking...');

    try {
      const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      if (sellersSnapshot.size > 0) {
        setPhoneExists(true);
        setPhoneCheckMessage('❌ Phone already registered');
        setPhoneError('Phone number already in use');
        setCheckingPhone(false);
        lastCheckedPhone.current = cleaned;
        return true;
      }

      const requestsQuery = query(collection(db, 'sellerRequests'), where('phone', '==', cleaned));
      const requestsSnapshot = await getDocs(requestsQuery);
      
      if (requestsSnapshot.size > 0) {
        const status = requestsSnapshot.docs[0].data().status;
        if (status === 'pending' || status === 'approved') {
          setPhoneExists(true);
          setPhoneCheckMessage('❌ Phone in use');
          setPhoneError('Phone already registered');
          setCheckingPhone(false);
          lastCheckedPhone.current = cleaned;
          return true;
        }
      }

      setPhoneExists(false);
      setPhoneCheckMessage('✅ Available');
      setPhoneError('');
      setCheckingPhone(false);
      lastCheckedPhone.current = cleaned;
      return false;

    } catch (error) {
      console.error('❌ Phone check error:', error);
      setPhoneCheckMessage('');
      setPhoneExists(false);
      setCheckingPhone(false);
      return false;
    }
  };

  // 🏢 CHECK BUSINESS NAME
  const checkBusinessNameExists = async (name: string): Promise<boolean> => {
    const normalized = name.toLowerCase().trim();
    
    if (!normalized || normalized.length < 3) {
      return false;
    }

    if (lastCheckedBusinessName.current === normalized) {
      return businessNameExists;
    }

    setCheckingBusinessName(true);
    setBusinessNameCheckMessage('🔍 Checking...');

    try {
      const sellersQuery = query(collection(db, 'sellers'), where('businessName', '==', normalized));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      if (sellersSnapshot.size > 0) {
        setBusinessNameExists(true);
        setBusinessNameCheckMessage('⚠️ Similar name exists');
        setBusinessNameError('Consider using a unique name');
        setCheckingBusinessName(false);
        lastCheckedBusinessName.current = normalized;
        return true;
      }

      setBusinessNameExists(false);
      setBusinessNameCheckMessage('✅ Unique');
      setBusinessNameError('');
      setCheckingBusinessName(false);
      lastCheckedBusinessName.current = normalized;
      return false;

    } catch (error) {
      console.error('❌ Business name check error:', error);
      setBusinessNameCheckMessage('');
      setBusinessNameExists(false);
      setCheckingBusinessName(false);
      return false;
    }
  };

  // ⏱️ DEBOUNCED CHECKS
  useEffect(() => {
    if (!formData.email) {
      setEmailExists(false);
      setEmailCheckMessage('');
      setEmailError('');
      setDomainSuggestion('');
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailExists(false);
      setEmailCheckMessage('');
      // Show error if @ is missing
      if (!formData.email.includes('@')) {
        setEmailError('Email must contain @');
      }
      return;
    }

    if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) {
      return;
    }

    const timer = setTimeout(() => {
      checkEmailExists(formData.email);
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const cleaned = formData.phone.replace(/\D/g, '');
    
    if (!cleaned || cleaned.length !== 10) {
      setPhoneExists(false);
      setPhoneCheckMessage('');
      return;
    }

    if (lastCheckedPhone.current === cleaned) {
      return;
    }

    const timer = setTimeout(() => {
      checkPhoneExists(formData.phone);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.phone]);

  useEffect(() => {
    const normalized = formData.businessName.toLowerCase().trim();
    
    if (!normalized || normalized.length < 3) {
      setBusinessNameExists(false);
      setBusinessNameCheckMessage('');
      return;
    }

    if (lastCheckedBusinessName.current === normalized) {
      return;
    }

    const timer = setTimeout(() => {
      checkBusinessNameExists(formData.businessName);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.businessName]);

  // 📝 INPUT CHANGE HANDLER
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (error) setError('');
    
    if (field === 'email') {
      setEmailCheckMessage('');
      setEmailExists(false);
      setDomainSuggestion('');
      lastCheckedEmail.current = '';
      if (emailError) setEmailError('');
    }
    
    if (field === 'phone') {
      setPhoneCheckMessage('');
      setPhoneExists(false);
      lastCheckedPhone.current = '';
      if (phoneError) setPhoneError('');
      if (value) {
        const validation = validatePhone(value);
        if (!validation.isValid) {
          setPhoneError(validation.error || 'Invalid');
        }
      }
    }
    
    if (field === 'businessName') {
      setBusinessNameCheckMessage('');
      setBusinessNameExists(false);
      lastCheckedBusinessName.current = '';
      if (businessNameError) setBusinessNameError('');
      if (value) {
        const validation = validateBusinessName(value);
        if (!validation.isValid) {
          setBusinessNameError(validation.error || 'Invalid');
        }
      }
    }
    
    if (field === 'ownerName') {
      if (nameError) setNameError('');
      if (value) {
        const validation = validateOwnerName(value);
        if (!validation.isValid) {
          setNameError(validation.error || 'Invalid');
        }
      }
    }
  };

  // 🔧 USE SUGGESTED EMAIL
  const useSuggestedEmail = () => {
    if (domainSuggestion) {
      setFormData(prev => ({ ...prev, email: domainSuggestion }));
      setDomainSuggestion('');
      setEmailError('');
      setEmailCheckMessage('');
      // Re-check new email
      lastCheckedEmail.current = '';
    }
  };

  // 🔄 RETRY EMAIL CHECK
  const retryEmailCheck = () => {
    lastCheckedEmail.current = '';
    checkEmailExists(formData.email);
  };

  // ✅ STRICT FORM VALIDATION (FIXED)
  const validateForm = (): boolean => {
    console.log('🔍 Validating form...');

    // Business name
    const businessValidation = validateBusinessName(formData.businessName);
    if (!businessValidation.isValid) {
      setBusinessNameError(businessValidation.error || 'Invalid');
      setError('Please fix business name');
      return false;
    }
    
    // Owner name
    const nameValidation = validateOwnerName(formData.ownerName);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Invalid');
      setError('Please fix owner name');
      return false;
    }
    
    // ✅ STRICT EMAIL VALIDATION
    if (!formData.email || formData.email.trim() === '') {
      setEmailError('Email is required');
      setError('Email is required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setEmailError('Email must contain @');
      setError('Email must contain @');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setEmailError('Enter a valid email address');
      setError('Enter a valid email (e.g., name@gmail.com)');
      return false;
    }

    // ❌ BLOCK IF DOMAIN TYPO EXISTS
    const domainCheck = validateEmailDomain(formData.email);
    if (domainCheck.hasTypo) {
      setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
      setError(`❌ Email typo detected! Use: ${domainCheck.suggestion}`);
      setDomainSuggestion(domainCheck.suggestion || '');
      return false;
    }

    // Phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Invalid');
      setError('Please fix phone number');
      return false;
    }
    
    // Address
    if (!formData.businessAddress.trim()) {
      setError('Business address required');
      return false;
    }
    
    console.log('✅ Form validation passed');
    return true;
  };

  // 📤 FORM SUBMIT (STRICT VALIDATION)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Form submission started');

    // 🚫 RATE LIMITING
    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
      const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
      alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
      return;
    }

    // ❌ BLOCK IF CHECKING IN PROGRESS
    if (checkingEmail || checkingPhone || checkInProgress.current) {
      alert('⏳ Please wait!\n\nEmail/Phone verification in progress.');
      return;
    }

    // ❌ BLOCK IF DOMAIN TYPO
    if (domainSuggestion) {
      alert(`❌ Invalid Email Domain!\n\nPlease use the suggested email:\n${domainSuggestion}\n\nClick the "Use This" button to fix.`);
      return;
    }

    // ✅ VALIDATE FORM
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    // ❌ STRICT EMAIL CHECK
    if (!formData.email.includes('@')) {
      setError('❌ Email must contain @');
      alert('❌ Invalid Email!\n\nEmail must contain @ symbol.');
      return;
    }

    const domainCheck = validateEmailDomain(formData.email);
    if (domainCheck.hasTypo) {
      setError(`❌ Email domain typo: Use ${domainCheck.suggestion}`);
      alert(`❌ Email Domain Typo!\n\nYou entered: ${formData.email}\n\nPlease use: ${domainCheck.suggestion}`);
      return;
    }

    // RE-VERIFY
    setSubmitting(true);
    setError('Final verification...');

    try {
      console.log('🔄 Re-verifying email...');
      const emailIsRegistered = await checkEmailExists(formData.email);
      if (emailIsRegistered) {
        setError('❌ Email already registered');
        alert('❌ Email Already Registered!\n\nThis email is already in use.\n\nUse a different email.');
        setSubmitting(false);
        return;
      }

      console.log('🔄 Re-verifying phone...');
      const phoneIsRegistered = await checkPhoneExists(formData.phone);
      if (phoneIsRegistered) {
        setError('❌ Phone already registered');
        alert('❌ Phone Already Registered!\n\nThis phone number is already in use.\n\nUse a different phone.');
        setSubmitting(false);
        return;
      }

      setError('');

    } catch (err) {
      console.error('❌ Verification error:', err);
      setError('Verification failed. Try again.');
      setSubmitting(false);
      return;
    }

    // FINAL CHECK
    if (emailExists || phoneExists) {
      alert('❌ Cannot Submit!\n\nDuplicate data found.');
      setSubmitting(false);
      return;
    }

    // ✅ SUBMIT TO FIRESTORE
    console.log('📤 Submitting to Firestore...');

    try {
      const docRef = await addDoc(collection(db, 'sellerRequests'), {
        businessName: formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        businessAddress: formData.businessAddress.trim(),
        additionalInfo: formData.additionalInfo.trim() || null,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        adminNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        emailDeliveryStatus: null,
        accountCreated: false
      });

      console.log('✅ SUCCESS! Doc ID:', docRef.id);
      lastSubmitTime.current = Date.now();
      setSubmitted(true);
      
    } catch (err: any) {
      console.error('❌ Firestore error:', err);
      
      if (err.code === 'permission-denied') {
        setError('❌ Permission denied. Contact support.');
      } else {
        setError('❌ Submission failed. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen sm:min-h-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50 border-2 border-green-300 rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 text-center mx-auto max-w-full shadow-xl">
        <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-green-600 mx-auto mb-4 sm:mb-6 animate-bounce" />
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-3 sm:mb-4 px-2">
          ✅ Request Submitted Successfully!
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-green-700 mb-6 px-2">
          Thank you <strong className="break-words">{formData.ownerName}</strong>!
        </p>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-left max-w-lg mx-auto border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📋</span> What's Next?
          </h4>
          <ul className="text-xs sm:text-sm md:text-base text-gray-700 space-y-2 sm:space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span>Review in <strong>2-3 business days</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span className="break-all">Updates to: <strong>{formData.email}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span>Login credentials if approved</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 sm:mt-8 bg-gray-100 rounded-lg p-3 sm:p-4 inline-block">
          <p className="text-xs sm:text-sm text-gray-600">Reference ID</p>
          <p className="text-base sm:text-lg font-mono font-bold text-gray-800">
            REQ-{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>
    );
  }

  // 📝 FORM UI
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden max-w-full">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
            <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
              Become a Seller Partner
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-blue-100 mt-1 sm:mt-2">
              Join our platform with 3D tile visualization
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
        {/* GLOBAL ERROR */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800 text-sm sm:text-base font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* BUSINESS NAME */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              <Store className="w-4 h-4 inline mr-2 text-blue-600" />
              Business Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={`w-full px-4 py-3 sm:py-3.5 pr-12 text-sm sm:text-base border-2 rounded-lg focus:ring-2 transition-all ${
                  businessNameError
                    ? 'border-red-400 bg-red-50 focus:ring-red-500'
                    : businessNameExists
                    ? 'border-orange-400 bg-orange-50 focus:ring-orange-500'
                    : businessNameCheckMessage
                    ? 'border-green-500 bg-green-50 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="ABC Tiles & Ceramics Pvt Ltd"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingBusinessName && (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )}
                {!checkingBusinessName && businessNameCheckMessage && !businessNameExists && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
                {!checkingBusinessName && businessNameExists && (
                  <span className="text-orange-600 text-xl">⚠</span>
                )}
              </div>
            </div>
            {businessNameError && (
              <p className="text-red-600 text-xs sm:text-sm mt-1.5 font-medium">⚠️ {businessNameError}</p>
            )}
            {businessNameCheckMessage && (
              <p className={`text-xs sm:text-sm mt-1.5 font-medium ${
                businessNameExists ? 'text-orange-600' : 'text-green-600'
              }`}>
                {businessNameCheckMessage}
              </p>
            )}
          </div>

          {/* OWNER NAME */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2 text-blue-600" />
              Owner Name *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 transition-all ${
                nameError 
                  ? 'border-red-400 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Rajesh Kumar"
              required
            />
            {nameError && (
              <p className="text-red-600 text-xs sm:text-sm mt-1.5 font-medium">⚠️ {nameError}</p>
            )}
          </div>

          {/* EMAIL (STRICT VALIDATION) */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2 text-blue-600" />
              Business Email * <span className="text-xs text-red-600">(Must be valid - e.g., name@gmail.com)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 sm:py-3.5 pr-12 text-sm sm:text-base border-2 rounded-lg focus:ring-2 transition-all ${
                  checkingEmail 
                    ? 'border-blue-500 bg-blue-50 focus:ring-blue-500' 
                    : emailExists || domainSuggestion
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : emailCheckMessage && !emailExists && !emailError
                    ? 'border-green-500 bg-green-50 focus:ring-green-500'
                    : emailError
                    ? 'border-orange-400 bg-orange-50 focus:ring-orange-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="business@gmail.com"
                required
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingEmail && (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                )}
                {!checkingEmail && emailCheckMessage && !emailExists && !emailError && !domainSuggestion && (
                  <span className="text-green-600 text-2xl">✓</span>
                )}
                {!checkingEmail && (emailExists || domainSuggestion) && (
                  <span className="text-red-600 text-2xl">✕</span>
                )}
              </div>
            </div>
            
            {/* TYPO SUGGESTION - BLOCKS SUBMISSION */}
            {domainSuggestion && (
              <div className="mt-2 p-3 rounded-lg bg-red-50 border-2 border-red-400 animate-pulse">
                <p className="text-red-800 text-xs sm:text-sm font-bold mb-2">
                  ❌ Invalid Email Domain Detected!
                </p>
                <p className="text-red-700 text-xs sm:text-sm font-semibold mb-3">
                  You typed: <strong className="text-red-900">{formData.email}</strong>
                  <br />
                  Did you mean: <strong className="text-green-700">{domainSuggestion}</strong>?
                </p>
                <button
                  type="button"
                  onClick={useSuggestedEmail}
                  className="w-full text-xs sm:text-sm bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all font-bold"
                >
                  ✅ Use Correct Email: {domainSuggestion}
                </button>
              </div>
            )}
            
            {emailError && !checkingEmail && !domainSuggestion && (
              <p className="text-red-600 text-xs sm:text-sm mt-1.5 font-medium">⚠️ {emailError}</p>
            )}
            
            {emailCheckMessage && !domainSuggestion && (
              <div className={`mt-2 flex items-center justify-between gap-2 p-2.5 rounded-lg text-xs sm:text-sm border-2 ${
                checkingEmail ? 'bg-blue-50 border-blue-300' : emailExists ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
              }`}>
                <p className={`font-semibold ${checkingEmail ? 'text-blue-800' : emailExists ? 'text-red-800' : 'text-green-800'}`}>
                  {emailCheckMessage}
                </p>
                {!checkingEmail && emailCheckMessage.includes('failed') && (
                  <button
                    type="button"
                    onClick={retryEmailCheck}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* PHONE */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2 text-blue-600" />
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 sm:py-3.5 pr-12 text-sm sm:text-base border-2 rounded-lg focus:ring-2 transition-all ${
                  checkingPhone
                    ? 'border-blue-500 bg-blue-50 focus:ring-blue-500'
                    : phoneExists
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : phoneCheckMessage && !phoneExists
                    ? 'border-green-500 bg-green-50 focus:ring-green-500'
                    : phoneError 
                    ? 'border-red-400 bg-red-50 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="9876543210"
                maxLength={10}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingPhone && (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )}
                {!checkingPhone && phoneCheckMessage && !phoneExists && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
                {!checkingPhone && phoneExists && (
                  <span className="text-red-600 text-xl">✕</span>
                )}
              </div>
            </div>
            {phoneError && !checkingPhone && (
              <p className="text-red-600 text-xs sm:text-sm mt-1.5 font-medium">⚠️ {phoneError}</p>
            )}
            {phoneCheckMessage && (
              <p className={`text-xs sm:text-sm mt-1.5 font-medium ${phoneExists ? 'text-red-600' : 'text-green-600'}`}>
                {phoneCheckMessage}
              </p>
            )}
          </div>
        </div>
        
        {/* ADDRESS */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
            Business Address *
          </label>
          <textarea
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            rows={3}
            placeholder="Shop 123, ABC Market, XYZ City, State - 123456"
            required
          />
        </div>
        
        {/* ADDITIONAL INFO */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Additional Info (Optional)
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            rows={3}
            placeholder="Years in business, certifications, etc."
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={
            submitting || 
            checkingEmail || 
            checkingPhone ||
            emailExists || 
            phoneExists ||
            !!emailError || 
            !!phoneError || 
            !!nameError ||
            !!businessNameError ||
            !!domainSuggestion
          }
          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white py-4 sm:py-5 rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-base sm:text-lg md:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-lg hover:shadow-xl"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : checkingEmail || checkingPhone ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : emailExists || phoneExists ? (
            <span>❌ Duplicate Data</span>
          ) : domainSuggestion ? (
            <span>❌ Fix Email Domain First</span>
          ) : (
            <>
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Submit Request</span>
            </>
          )}
        </button>

        {/* STATUS */}
        <div className="text-center text-sm sm:text-base font-semibold">
          {(checkingEmail || checkingPhone) && (
            <p className="text-blue-700 animate-pulse">🔍 Verifying data...</p>
          )}
          {domainSuggestion && (
            <p className="text-red-700 animate-pulse">❌ Email domain typo detected - Fix required!</p>
          )}
          {(emailExists || phoneExists) && !(checkingEmail || checkingPhone) && (
            <p className="text-red-700">❌ Duplicate data - Cannot submit</p>
          )}
          {!emailExists && !phoneExists && !domainSuggestion && (emailCheckMessage || phoneCheckMessage) && !(checkingEmail || checkingPhone) && !emailError && !phoneError && (
            <p className="text-green-700">✅ All verified - Ready to submit</p>
          )}
        </div>

        {/* BENEFITS */}
        <div className="bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-200 shadow-inner">
          <p className="font-bold text-gray-800 mb-3 text-base sm:text-lg flex items-center gap-2">
            <span className="text-xl sm:text-2xl">✨</span> Why Join Our Platform?
          </p>
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm md:text-base text-gray-700">
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span><strong>3D Visualization</strong> - Customers see tiles in their space</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span><strong>Analytics Dashboard</strong> - Track performance</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span><strong>QR Integration</strong> - Connect physical & digital</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-green-600 font-bold text-lg">•</span>
              <span><strong>Wider Reach</strong> - Access thousands of customers</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};