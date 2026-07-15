
// // // // import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
// // // // import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User, Loader2, RefreshCw, Sparkles } from 'lucide-react';
// // // // import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// // // // import { db } from '../lib/firebase';

// // // // interface FormData {
// // // //   businessName: string;
// // // //   ownerName: string;
// // // //   email: string;
// // // //   phone: string;
// // // //   businessAddress: string;
// // // //   additionalInfo: string;
// // // // }

// // // // // ✨ Memoized Input Component for Performance
// // // // const InputField = memo(({ 
// // // //   label, 
// // // //   icon: Icon, 
// // // //   type = 'text',
// // // //   value, 
// // // //   onChange, 
// // // //   placeholder, 
// // // //   error, 
// // // //   checkMessage,
// // // //   checking,
// // // //   exists,
// // // //   required = false,
// // // //   maxLength,
// // // //   rows,
// // // //   description
// // // // }: any) => {
// // // //   const isTextarea = type === 'textarea';
// // // //   const InputComponent = isTextarea ? 'textarea' : 'input';

// // // //   return (
// // // //     <div className="w-full">
// // // //       <label className="block text-gray-800 mb-2 font-semibold text-[clamp(0.813rem,2vw,0.938rem)] sm:text-[clamp(0.875rem,2vw,1rem)] leading-tight">
// // // //         {Icon && <Icon className="w-[clamp(0.875rem,2vw,1rem)] h-[clamp(0.875rem,2vw,1rem)] inline mr-2 text-blue-600 align-text-bottom" />}
// // // //         <span>{label}</span>
// // // //         {required && <span className="text-red-600 ml-1">*</span>}
// // // //       </label>
      
// // // //       {description && (
// // // //         <p className="text-[clamp(0.688rem,1.5vw,0.75rem)] text-red-600 mb-2 font-medium leading-tight">
// // // //           {description}
// // // //         </p>
// // // //       )}
      
// // // //       <div className="relative">
// // // //         <InputComponent
// // // //           type={!isTextarea ? type : undefined}
// // // //           value={value}
// // // //           onChange={onChange}
// // // //           className={`
// // // //             w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5
// // // //             ${!isTextarea ? 'pr-10 sm:pr-12' : ''}
// // // //             text-[clamp(0.813rem,2vw,0.938rem)] sm:text-[clamp(0.875rem,2vw,1rem)]
// // // //             border-2 rounded-lg sm:rounded-xl
// // // //             focus:ring-2 focus:ring-offset-1
// // // //             transition-all duration-300 ease-in-out
// // // //             ${error 
// // // //               ? 'border-red-400 bg-red-50/50 focus:ring-red-500 focus:border-red-500' 
// // // //               : exists
// // // //               ? 'border-red-500 bg-red-50/50 focus:ring-red-500 focus:border-red-500'
// // // //               : checking
// // // //               ? 'border-blue-400 bg-blue-50/50 focus:ring-blue-500 focus:border-blue-500 animate-pulse'
// // // //               : checkMessage && !error
// // // //               ? 'border-green-500 bg-green-50/50 focus:ring-green-500 focus:border-green-500'
// // // //               : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
// // // //             }
// // // //             placeholder:text-gray-400
// // // //             disabled:opacity-60 disabled:cursor-not-allowed
// // // //             ${isTextarea ? 'resize-none' : ''}
// // // //           `}
// // // //           placeholder={placeholder}
// // // //           required={required}
// // // //           maxLength={maxLength}
// // // //           rows={rows}
// // // //         />
        
// // // //         {!isTextarea && (checking || checkMessage) && (
// // // //           <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 transition-all duration-300">
// // // //             {checking && (
// // // //               <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-spin" />
// // // //             )}
// // // //             {!checking && checkMessage && !exists && !error && (
// // // //               <span className="text-green-600 text-xl sm:text-2xl animate-scale-in">✓</span>
// // // //             )}
// // // //             {!checking && exists && (
// // // //               <span className="text-red-600 text-xl sm:text-2xl animate-shake">✕</span>
// // // //             )}
// // // //           </div>
// // // //         )}
// // // //       </div>
      
// // // //       {error && (
// // // //         <p className="text-red-600 text-[clamp(0.75rem,1.8vw,0.875rem)] mt-1.5 sm:mt-2 font-medium flex items-start gap-1.5 animate-slide-down">
// // // //           <span className="text-base sm:text-lg">⚠️</span>
// // // //           <span className="leading-tight">{error}</span>
// // // //         </p>
// // // //       )}
      
// // // //       {checkMessage && !error && (
// // // //         <p className={`
// // // //           text-[clamp(0.75rem,1.8vw,0.875rem)] mt-1.5 sm:mt-2 font-medium
// // // //           ${checking ? 'text-blue-700' : exists ? 'text-red-700' : 'text-green-700'}
// // // //           animate-slide-down leading-tight
// // // //         `}>
// // // //           {checkMessage}
// // // //         </p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // });

// // // // InputField.displayName = 'InputField';

// // // // export const SellerRequestForm: React.FC = () => {
// // // //   // 📝 FORM DATA (with localStorage persistence)
// // // //   const [formData, setFormData] = useState<FormData>(() => {
// // // //     const saved = localStorage.getItem('sellerRequestDraft');
// // // //     if (saved) {
// // // //       try {
// // // //         return JSON.parse(saved);
// // // //       } catch {
// // // //         return {
// // // //           businessName: '',
// // // //           ownerName: '',
// // // //           email: '',
// // // //           phone: '',
// // // //           businessAddress: '',
// // // //           additionalInfo: ''
// // // //         };
// // // //       }
// // // //     }
// // // //     return {
// // // //       businessName: '',
// // // //       ownerName: '',
// // // //       email: '',
// // // //       phone: '',
// // // //       businessAddress: '',
// // // //       additionalInfo: ''
// // // //     };
// // // //   });
  
// // // //   // 🔄 SUBMISSION STATES
// // // //   const [submitting, setSubmitting] = useState(false);
// // // //   const [submitted, setSubmitted] = useState(false);
// // // //   const [error, setError] = useState('');
  
// // // //   // ⚠️ FIELD VALIDATION ERRORS
// // // //   const [emailError, setEmailError] = useState('');
// // // //   const [phoneError, setPhoneError] = useState('');
// // // //   const [nameError, setNameError] = useState('');
// // // //   const [businessNameError, setBusinessNameError] = useState('');
// // // //   const [domainSuggestion, setDomainSuggestion] = useState('');

// // // //   // 🔍 EMAIL CHECK STATES
// // // //   const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
// // // //   const [emailExists, setEmailExists] = useState<boolean>(false);
// // // //   const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');
  
// // // //   // 📱 PHONE CHECK STATES
// // // //   const [checkingPhone, setCheckingPhone] = useState<boolean>(false);
// // // //   const [phoneExists, setPhoneExists] = useState<boolean>(false);
// // // //   const [phoneCheckMessage, setPhoneCheckMessage] = useState<string>('');

// // // //   // 🏢 BUSINESS NAME CHECK STATES
// // // //   const [checkingBusinessName, setCheckingBusinessName] = useState<boolean>(false);
// // // //   const [businessNameExists, setBusinessNameExists] = useState<boolean>(false);
// // // //   const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState<string>('');
  
// // // //   // 🛡️ RACE CONDITION PREVENTION
// // // //   const lastCheckedEmail = useRef<string>('');
// // // //   const lastCheckedPhone = useRef<string>('');
// // // //   const lastCheckedBusinessName = useRef<string>('');
// // // //   const checkInProgress = useRef<boolean>(false);
  
// // // //   // 🚫 RATE LIMITING
// // // //   const lastSubmitTime = useRef<number>(0);
// // // //   const SUBMIT_COOLDOWN = 5000;

// // // //   // 💾 SAVE FORM DATA
// // // //   useEffect(() => {
// // // //     if (!submitted) {
// // // //       const timer = setTimeout(() => {
// // // //         localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
// // // //       }, 500);
// // // //       return () => clearTimeout(timer);
// // // //     }
// // // //   }, [formData, submitted]);

// // // //   // 🧹 CLEAR DRAFT ON SUCCESS
// // // //   useEffect(() => {
// // // //     if (submitted) {
// // // //       localStorage.removeItem('sellerRequestDraft');
// // // //     }
// // // //   }, [submitted]);

// // // //   // ✅ STRICT EMAIL FORMAT VALIDATION
// // // //   const validateEmail = useMemo(() => (email: string): boolean => {
// // // //     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
// // // //     if (!regex.test(email)) return false;
    
// // // //     const parts = email.split('@');
// // // //     if (parts.length !== 2) return false;
// // // //     if (parts[0].length === 0) return false;
// // // //     if (parts[1].length === 0) return false;
// // // //     if (!parts[1].includes('.')) return false;
    
// // // //     return true;
// // // //   }, []);

// // // //   // 🔧 EMAIL DOMAIN TYPO DETECTION
// // // //   const validateEmailDomain = useMemo(() => (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
// // // //     const commonTypos: Record<string, string> = {
// // // //       'gmali.com': 'gmail.com',
// // // //       'gmai.com': 'gmail.com',
// // // //       'gmil.com': 'gmail.com',
// // // //       'gmaill.com': 'gmail.com',
// // // //       'gamil.com': 'gmail.com',
// // // //       'gmial.com': 'gmail.com',
// // // //       'gmaol.com': 'gmail.com',
// // // //       'gnail.com': 'gmail.com',
// // // //       'yahooo.com': 'yahoo.com',
// // // //       'yaho.com': 'yahoo.com',
// // // //       'yahho.com': 'yahoo.com',
// // // //       'yahhoo.com': 'yahoo.com',
// // // //       'hotmial.com': 'hotmail.com',
// // // //       'hotmali.com': 'hotmail.com',
// // // //       'hotmai.com': 'hotmail.com',
// // // //       'outlok.com': 'outlook.com',
// // // //       'outloo.com': 'outlook.com',
// // // //       'outluk.com': 'outlook.com'
// // // //     };
    
// // // //     const parts = email.split('@');
// // // //     if (parts.length !== 2) {
// // // //       return { isValid: false, hasTypo: false };
// // // //     }
    
// // // //     const domain = parts[1]?.toLowerCase();
// // // //     if (!domain) {
// // // //       return { isValid: false, hasTypo: false };
// // // //     }
    
// // // //     if (commonTypos[domain]) {
// // // //       const suggestion = parts[0] + '@' + commonTypos[domain];
// // // //       return { isValid: false, suggestion, hasTypo: true };
// // // //     }
    
// // // //     return { isValid: true, hasTypo: false };
// // // //   }, []);

// // // //   // 📱 PHONE VALIDATION
// // // //   const validatePhone = useMemo(() => (phone: string): { isValid: boolean; error?: string } => {
// // // //     const cleaned = phone.replace(/\D/g, '');
    
// // // //     if (!cleaned) {
// // // //       return { isValid: false, error: 'Phone number required' };
// // // //     }
    
// // // //     if (cleaned.length !== 10) {
// // // //       return { isValid: false, error: 'Must be exactly 10 digits' };
// // // //     }
    
// // // //     if (!/^[6-9]/.test(cleaned)) {
// // // //       return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
// // // //     }
    
// // // //     return { isValid: true };
// // // //   }, []);

// // // //   // 👤 NAME VALIDATION
// // // //   const validateOwnerName = useMemo(() => (name: string): { isValid: boolean; error?: string } => {
// // // //     if (!name.trim()) {
// // // //       return { isValid: false, error: 'Owner name required' };
// // // //     }
    
// // // //     if (name.trim().length < 2) {
// // // //       return { isValid: false, error: 'At least 2 characters required' };
// // // //     }
    
// // // //     if (/\d/.test(name)) {
// // // //       return { isValid: false, error: 'Cannot contain numbers' };
// // // //     }
    
// // // //     if (!/^[a-zA-Z\s]+$/.test(name)) {
// // // //       return { isValid: false, error: 'Only letters and spaces allowed' };
// // // //     }
    
// // // //     return { isValid: true };
// // // //   }, []);

// // // //   // 🏢 BUSINESS NAME VALIDATION
// // // //   const validateBusinessName = useMemo(() => (name: string): { isValid: boolean; error?: string } => {
// // // //     if (!name.trim()) {
// // // //       return { isValid: false, error: 'Business name required' };
// // // //     }
    
// // // //     if (name.trim().length < 3) {
// // // //       return { isValid: false, error: 'At least 3 characters required' };
// // // //     }
    
// // // //     if (name.trim().length > 100) {
// // // //       return { isValid: false, error: 'Maximum 100 characters allowed' };
// // // //     }
    
// // // //     return { isValid: true };
// // // //   }, []);

// // // //   // 🔍 CHECK EMAIL IN DATABASE
// // // //   const checkEmailExists = async (email: string): Promise<boolean> => {
// // // //     if (checkInProgress.current) {
// // // //       return emailExists;
// // // //     }

// // // //     if (!email || !validateEmail(email)) {
// // // //       return false;
// // // //     }

// // // //     const domainCheck = validateEmailDomain(email);
// // // //     if (domainCheck.hasTypo && domainCheck.suggestion) {
// // // //       setDomainSuggestion(domainCheck.suggestion);
// // // //       setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
// // // //       setEmailExists(false);
// // // //       setEmailCheckMessage('❌ Invalid domain - Fix typo');
// // // //       return false;
// // // //     } else {
// // // //       setDomainSuggestion('');
// // // //     }

// // // //     checkInProgress.current = true;
// // // //     setCheckingEmail(true);
// // // //     setEmailCheckMessage('🔍 Checking...');

// // // //     try {
// // // //       const emailToCheck = email.toLowerCase().trim();

// // // //       const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
// // // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // // //       if (sellersSnapshot.size > 0) {
// // // //         setEmailExists(true);
// // // //         setEmailCheckMessage('❌ Already registered as seller');
// // // //         setEmailError('Email already registered');
// // // //         setCheckingEmail(false);
// // // //         checkInProgress.current = false;
// // // //         lastCheckedEmail.current = emailToCheck;
// // // //         return true;
// // // //       }

// // // //       try {
// // // //         const usersQuery = query(collection(db, 'users'), where('email', '==', emailToCheck));
// // // //         const usersSnapshot = await getDocs(usersQuery);
        
// // // //         if (usersSnapshot.size > 0) {
// // // //           setEmailExists(true);
// // // //           setEmailCheckMessage('❌ Already registered');
// // // //           setEmailError('Email already in use');
// // // //           setCheckingEmail(false);
// // // //           checkInProgress.current = false;
// // // //           lastCheckedEmail.current = emailToCheck;
// // // //           return true;
// // // //         }
// // // //       } catch (err) {
// // // //         console.log('⚠️ Users check skipped');
// // // //       }

// // // //       try {
// // // //         const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
// // // //         const requestsSnapshot = await getDocs(requestsQuery);
        
// // // //         if (requestsSnapshot.size > 0) {
// // // //           const status = requestsSnapshot.docs[0].data().status;
          
// // // //           if (status === 'pending') {
// // // //             setEmailExists(true);
// // // //             setEmailCheckMessage('⏳ Request pending');
// // // //             setEmailError('Request already pending');
// // // //             setCheckingEmail(false);
// // // //             checkInProgress.current = false;
// // // //             lastCheckedEmail.current = emailToCheck;
// // // //             return true;
// // // //           } else if (status === 'approved') {
// // // //             setEmailExists(true);
// // // //             setEmailCheckMessage('✅ Already approved');
// // // //             setEmailError('Account already exists');
// // // //             setCheckingEmail(false);
// // // //             checkInProgress.current = false;
// // // //             lastCheckedEmail.current = emailToCheck;
// // // //             return true;
// // // //           } else if (status === 'rejected') {
// // // //             setEmailExists(false);
// // // //             setEmailCheckMessage('⚠️ Can reapply');
// // // //             setEmailError('');
// // // //             setCheckingEmail(false);
// // // //             checkInProgress.current = false;
// // // //             lastCheckedEmail.current = emailToCheck;
// // // //             return false;
// // // //           }
// // // //         }
// // // //       } catch (err) {
// // // //         console.log('⚠️ Requests check skipped');
// // // //       }

// // // //       setEmailExists(false);
// // // //       setEmailCheckMessage('✅ Available');
// // // //       setEmailError('');
// // // //       setCheckingEmail(false);
// // // //       checkInProgress.current = false;
// // // //       lastCheckedEmail.current = emailToCheck;
// // // //       return false;

// // // //     } catch (error) {
// // // //       console.error('❌ Email check error:', error);
// // // //       setEmailCheckMessage('⚠️ Check failed');
// // // //       setEmailExists(false);
// // // //       setCheckingEmail(false);
// // // //       checkInProgress.current = false;
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // 📱 CHECK PHONE IN DATABASE
// // // //   const checkPhoneExists = async (phone: string): Promise<boolean> => {
// // // //     const cleaned = phone.replace(/\D/g, '');
    
// // // //     if (!cleaned || cleaned.length !== 10) {
// // // //       return false;
// // // //     }

// // // //     if (lastCheckedPhone.current === cleaned) {
// // // //       return phoneExists;
// // // //     }

// // // //     setCheckingPhone(true);
// // // //     setPhoneCheckMessage('🔍 Checking...');

// // // //     try {
// // // //       const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
// // // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // // //       if (sellersSnapshot.size > 0) {
// // // //         setPhoneExists(true);
// // // //         setPhoneCheckMessage('❌ Phone already registered');
// // // //         setPhoneError('Phone number already in use');
// // // //         setCheckingPhone(false);
// // // //         lastCheckedPhone.current = cleaned;
// // // //         return true;
// // // //       }

// // // //       const requestsQuery = query(collection(db, 'sellerRequests'), where('phone', '==', cleaned));
// // // //       const requestsSnapshot = await getDocs(requestsQuery);
      
// // // //       if (requestsSnapshot.size > 0) {
// // // //         const status = requestsSnapshot.docs[0].data().status;
// // // //         if (status === 'pending' || status === 'approved') {
// // // //           setPhoneExists(true);
// // // //           setPhoneCheckMessage('❌ Phone in use');
// // // //           setPhoneError('Phone already registered');
// // // //           setCheckingPhone(false);
// // // //           lastCheckedPhone.current = cleaned;
// // // //           return true;
// // // //         }
// // // //       }

// // // //       setPhoneExists(false);
// // // //       setPhoneCheckMessage('✅ Available');
// // // //       setPhoneError('');
// // // //       setCheckingPhone(false);
// // // //       lastCheckedPhone.current = cleaned;
// // // //       return false;

// // // //     } catch (error) {
// // // //       console.error('❌ Phone check error:', error);
// // // //       setPhoneCheckMessage('');
// // // //       setPhoneExists(false);
// // // //       setCheckingPhone(false);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // 🏢 CHECK BUSINESS NAME
// // // //   const checkBusinessNameExists = async (name: string): Promise<boolean> => {
// // // //     const normalized = name.toLowerCase().trim();
    
// // // //     if (!normalized || normalized.length < 3) {
// // // //       return false;
// // // //     }

// // // //     if (lastCheckedBusinessName.current === normalized) {
// // // //       return businessNameExists;
// // // //     }

// // // //     setCheckingBusinessName(true);
// // // //     setBusinessNameCheckMessage('🔍 Checking...');

// // // //     try {
// // // //       const sellersQuery = query(collection(db, 'sellers'), where('businessName', '==', normalized));
// // // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // // //       if (sellersSnapshot.size > 0) {
// // // //         setBusinessNameExists(true);
// // // //         setBusinessNameCheckMessage('⚠️ Similar name exists');
// // // //         setBusinessNameError('Consider using a unique name');
// // // //         setCheckingBusinessName(false);
// // // //         lastCheckedBusinessName.current = normalized;
// // // //         return true;
// // // //       }

// // // //       setBusinessNameExists(false);
// // // //       setBusinessNameCheckMessage('✅ Unique');
// // // //       setBusinessNameError('');
// // // //       setCheckingBusinessName(false);
// // // //       lastCheckedBusinessName.current = normalized;
// // // //       return false;

// // // //     } catch (error) {
// // // //       console.error('❌ Business name check error:', error);
// // // //       setBusinessNameCheckMessage('');
// // // //       setBusinessNameExists(false);
// // // //       setCheckingBusinessName(false);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // ⏱️ DEBOUNCED CHECKS
// // // //   useEffect(() => {
// // // //     if (!formData.email) {
// // // //       setEmailExists(false);
// // // //       setEmailCheckMessage('');
// // // //       setEmailError('');
// // // //       setDomainSuggestion('');
// // // //       return;
// // // //     }

// // // //     if (!validateEmail(formData.email)) {
// // // //       setEmailExists(false);
// // // //       setEmailCheckMessage('');
// // // //       if (!formData.email.includes('@')) {
// // // //         setEmailError('Email must contain @');
// // // //       }
// // // //       return;
// // // //     }

// // // //     if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) {
// // // //       return;
// // // //     }

// // // //     const timer = setTimeout(() => {
// // // //       checkEmailExists(formData.email);
// // // //     }, 800);

// // // //     return () => clearTimeout(timer);
// // // //   }, [formData.email]);

// // // //   useEffect(() => {
// // // //     const cleaned = formData.phone.replace(/\D/g, '');
    
// // // //     if (!cleaned || cleaned.length !== 10) {
// // // //       setPhoneExists(false);
// // // //       setPhoneCheckMessage('');
// // // //       return;
// // // //     }

// // // //     if (lastCheckedPhone.current === cleaned) {
// // // //       return;
// // // //     }

// // // //     const timer = setTimeout(() => {
// // // //       checkPhoneExists(formData.phone);
// // // //     }, 1000);

// // // //     return () => clearTimeout(timer);
// // // //   }, [formData.phone]);

// // // //   useEffect(() => {
// // // //     const normalized = formData.businessName.toLowerCase().trim();
    
// // // //     if (!normalized || normalized.length < 3) {
// // // //       setBusinessNameExists(false);
// // // //       setBusinessNameCheckMessage('');
// // // //       return;
// // // //     }

// // // //     if (lastCheckedBusinessName.current === normalized) {
// // // //       return;
// // // //     }

// // // //     const timer = setTimeout(() => {
// // // //       checkBusinessNameExists(formData.businessName);
// // // //     }, 1000);

// // // //     return () => clearTimeout(timer);
// // // //   }, [formData.businessName]);

// // // //   // 📝 INPUT CHANGE HANDLER
// // // //   const handleInputChange = (field: keyof FormData, value: string) => {
// // // //     setFormData(prev => ({ ...prev, [field]: value }));
    
// // // //     if (error) setError('');
    
// // // //     if (field === 'email') {
// // // //       setEmailCheckMessage('');
// // // //       setEmailExists(false);
// // // //       setDomainSuggestion('');
// // // //       lastCheckedEmail.current = '';
// // // //       if (emailError) setEmailError('');
// // // //     }
    
// // // //     if (field === 'phone') {
// // // //       setPhoneCheckMessage('');
// // // //       setPhoneExists(false);
// // // //       lastCheckedPhone.current = '';
// // // //       if (phoneError) setPhoneError('');
// // // //       if (value) {
// // // //         const validation = validatePhone(value);
// // // //         if (!validation.isValid) {
// // // //           setPhoneError(validation.error || 'Invalid');
// // // //         }
// // // //       }
// // // //     }
    
// // // //     if (field === 'businessName') {
// // // //       setBusinessNameCheckMessage('');
// // // //       setBusinessNameExists(false);
// // // //       lastCheckedBusinessName.current = '';
// // // //       if (businessNameError) setBusinessNameError('');
// // // //       if (value) {
// // // //         const validation = validateBusinessName(value);
// // // //         if (!validation.isValid) {
// // // //           setBusinessNameError(validation.error || 'Invalid');
// // // //         }
// // // //       }
// // // //     }
    
// // // //     if (field === 'ownerName') {
// // // //       if (nameError) setNameError('');
// // // //       if (value) {
// // // //         const validation = validateOwnerName(value);
// // // //         if (!validation.isValid) {
// // // //           setNameError(validation.error || 'Invalid');
// // // //         }
// // // //       }
// // // //     }
// // // //   };

// // // //   // 🔧 USE SUGGESTED EMAIL
// // // //   const useSuggestedEmail = () => {
// // // //     if (domainSuggestion) {
// // // //       setFormData(prev => ({ ...prev, email: domainSuggestion }));
// // // //       setDomainSuggestion('');
// // // //       setEmailError('');
// // // //       setEmailCheckMessage('');
// // // //       lastCheckedEmail.current = '';
// // // //     }
// // // //   };

// // // //   // 🔄 RETRY EMAIL CHECK
// // // //   const retryEmailCheck = () => {
// // // //     lastCheckedEmail.current = '';
// // // //     checkEmailExists(formData.email);
// // // //   };

// // // //   // ✅ STRICT FORM VALIDATION
// // // //   const validateForm = (): boolean => {
// // // //     const businessValidation = validateBusinessName(formData.businessName);
// // // //     if (!businessValidation.isValid) {
// // // //       setBusinessNameError(businessValidation.error || 'Invalid');
// // // //       setError('Please fix business name');
// // // //       return false;
// // // //     }
    
// // // //     const nameValidation = validateOwnerName(formData.ownerName);
// // // //     if (!nameValidation.isValid) {
// // // //       setNameError(nameValidation.error || 'Invalid');
// // // //       setError('Please fix owner name');
// // // //       return false;
// // // //     }
    
// // // //     if (!formData.email || formData.email.trim() === '') {
// // // //       setEmailError('Email is required');
// // // //       setError('Email is required');
// // // //       return false;
// // // //     }

// // // //     if (!formData.email.includes('@')) {
// // // //       setEmailError('Email must contain @');
// // // //       setError('Email must contain @');
// // // //       return false;
// // // //     }

// // // //     if (!validateEmail(formData.email)) {
// // // //       setEmailError('Enter a valid email address');
// // // //       setError('Enter a valid email (e.g., name@gmail.com)');
// // // //       return false;
// // // //     }

// // // //     const domainCheck = validateEmailDomain(formData.email);
// // // //     if (domainCheck.hasTypo) {
// // // //       setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
// // // //       setError(`❌ Email typo detected! Use: ${domainCheck.suggestion}`);
// // // //       setDomainSuggestion(domainCheck.suggestion || '');
// // // //       return false;
// // // //     }

// // // //     const phoneValidation = validatePhone(formData.phone);
// // // //     if (!phoneValidation.isValid) {
// // // //       setPhoneError(phoneValidation.error || 'Invalid');
// // // //       setError('Please fix phone number');
// // // //       return false;
// // // //     }
    
// // // //     if (!formData.businessAddress.trim()) {
// // // //       setError('Business address required');
// // // //       return false;
// // // //     }
    
// // // //     return true;
// // // //   };

// // // //   // 📤 FORM SUBMIT
// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();

// // // //     const now = Date.now();
// // // //     if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
// // // //       const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
// // // //       alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
// // // //       return;
// // // //     }

// // // //     if (checkingEmail || checkingPhone || checkInProgress.current) {
// // // //       alert('⏳ Please wait!\n\nEmail/Phone verification in progress.');
// // // //       return;
// // // //     }

// // // //     if (domainSuggestion) {
// // // //       alert(`❌ Invalid Email Domain!\n\nPlease use the suggested email:\n${domainSuggestion}\n\nClick the "Use This" button to fix.`);
// // // //       return;
// // // //     }

// // // //     if (!validateForm()) {
// // // //       return;
// // // //     }

// // // //     if (!formData.email.includes('@')) {
// // // //       setError('❌ Email must contain @');
// // // //       alert('❌ Invalid Email!\n\nEmail must contain @ symbol.');
// // // //       return;
// // // //     }

// // // //     const domainCheck = validateEmailDomain(formData.email);
// // // //     if (domainCheck.hasTypo) {
// // // //       setError(`❌ Email domain typo: Use ${domainCheck.suggestion}`);
// // // //       alert(`❌ Email Domain Typo!\n\nYou entered: ${formData.email}\n\nPlease use: ${domainCheck.suggestion}`);
// // // //       return;
// // // //     }

// // // //     setSubmitting(true);
// // // //     setError('Final verification...');

// // // //     try {
// // // //       const emailIsRegistered = await checkEmailExists(formData.email);
// // // //       if (emailIsRegistered) {
// // // //         setError('❌ Email already registered');
// // // //         alert('❌ Email Already Registered!\n\nThis email is already in use.\n\nUse a different email.');
// // // //         setSubmitting(false);
// // // //         return;
// // // //       }

// // // //       const phoneIsRegistered = await checkPhoneExists(formData.phone);
// // // //       if (phoneIsRegistered) {
// // // //         setError('❌ Phone already registered');
// // // //         alert('❌ Phone Already Registered!\n\nThis phone number is already in use.\n\nUse a different phone.');
// // // //         setSubmitting(false);
// // // //         return;
// // // //       }

// // // //       setError('');

// // // //     } catch (err) {
// // // //       console.error('❌ Verification error:', err);
// // // //       setError('Verification failed. Try again.');
// // // //       setSubmitting(false);
// // // //       return;
// // // //     }

// // // //     if (emailExists || phoneExists) {
// // // //       alert('❌ Cannot Submit!\n\nDuplicate data found.');
// // // //       setSubmitting(false);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const docRef = await addDoc(collection(db, 'sellerRequests'), {
// // // //         businessName: formData.businessName.trim(),
// // // //         ownerName: formData.ownerName.trim(),
// // // //         email: formData.email.toLowerCase().trim(),
// // // //         phone: formData.phone.replace(/\D/g, ''),
// // // //         businessAddress: formData.businessAddress.trim(),
// // // //         additionalInfo: formData.additionalInfo.trim() || null,
// // // //         status: 'pending',
// // // //         requestedAt: new Date().toISOString(),
// // // //         adminNotes: null,
// // // //         reviewedAt: null,
// // // //         reviewedBy: null,
// // // //         emailDeliveryStatus: null,
// // // //         accountCreated: false
// // // //       });

// // // //       lastSubmitTime.current = Date.now();
// // // //       setSubmitted(true);
      
// // // //     } catch (err: any) {
// // // //       console.error('❌ Firestore error:', err);
      
// // // //       if (err.code === 'permission-denied') {
// // // //         setError('❌ Permission denied. Contact support.');
// // // //       } else {
// // // //         setError('❌ Submission failed. Try again.');
// // // //       }
// // // //     } finally {
// // // //       setSubmitting(false);
// // // //     }
// // // //   };

// // // //   // ✅ SUCCESS SCREEN
// // // //   if (submitted) {
// // // //     return (
// // // //       <div className="min-h-screen sm:min-h-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-2 border-green-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-center mx-auto max-w-full shadow-2xl animate-fade-in">
// // // //         <div className="animate-bounce-in">
// // // //           <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-green-600 mx-auto mb-4 sm:mb-6 drop-shadow-lg" />
// // // //         </div>
        
// // // //         <h3 className="text-[clamp(1.5rem,4vw,2rem)] sm:text-[clamp(1.75rem,4vw,2.25rem)] md:text-[clamp(2rem,4vw,2.5rem)] font-bold text-green-800 mb-3 sm:mb-4 px-2 leading-tight animate-slide-up">
// // // //           ✅ Request Submitted Successfully!
// // // //         </h3>
        
// // // //         <p className="text-[clamp(0.875rem,2vw,1rem)] sm:text-[clamp(1rem,2vw,1.125rem)] text-green-700 mb-6 sm:mb-8 px-2 animate-slide-up animation-delay-100">
// // // //           Thank you <strong className="break-words font-bold text-green-900">{formData.ownerName}</strong>!
// // // //         </p>
        
// // // //         <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-left max-w-2xl mx-auto border-2 border-gray-200 animate-slide-up animation-delay-200">
// // // //           <h4 className="font-bold text-gray-900 mb-4 sm:mb-5 text-[clamp(1rem,2.5vw,1.25rem)] sm:text-[clamp(1.125rem,2.5vw,1.375rem)] flex items-center gap-2 sm:gap-3">
// // // //             <span className="text-[clamp(1.25rem,3vw,1.5rem)] sm:text-[clamp(1.5rem,3vw,1.75rem)]">📋</span> 
// // // //             <span>What's Next ?</span>
// // // //           </h4>
          
// // // //           <ul className="text-[clamp(0.813rem,2vw,0.938rem)] sm:text-[clamp(0.938rem,2vw,1.063rem)] text-gray-700 space-y-3 sm:space-y-4">
// // // //             <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
// // // //               <span className="leading-relaxed">Review in <strong className="text-gray-900">2-3 business days</strong></span>
// // // //             </li>
// // // //             <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
// // // //               <span className="break-all leading-relaxed">Updates to: <strong className="text-gray-900">{formData.email}</strong></span>
// // // //             </li>
// // // //             <li className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
// // // //               <span className="leading-relaxed">Login credentials if <strong className="text-gray-900">approved</strong></span>
// // // //             </li>
// // // //           </ul>
// // // //         </div>
        
// // // //         <div className="mt-6 sm:mt-8 md:mt-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 inline-block shadow-lg animate-slide-up animation-delay-300">
// // // //           <p className="text-[clamp(0.688rem,1.5vw,0.75rem)] sm:text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-600 mb-1 sm:mb-2">Reference ID</p>
// // // //           <p className="text-[clamp(1rem,2.5vw,1.25rem)] sm:text-[clamp(1.125rem,2.5vw,1.375rem)] font-mono font-bold text-gray-900 tracking-wider">
// // // //             REQ-{Date.now().toString().slice(-8)}
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // 📝 FORM UI
// // // //   return (
// // // //     <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden max-w-full animate-fade-in">
// // // //       {/* HEADER */}
// // // //       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
// // // //         <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
// // // //         <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5">
// // // //           <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110">
// // // //             <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
// // // //           </div>
          
// // // //           <div className="flex-1">
// // // //             <h2 className="text-[clamp(1.25rem,3.5vw,1.75rem)] sm:text-[clamp(1.5rem,3.5vw,2rem)] md:text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold leading-tight mb-1 sm:mb-2">
// // // //               Become a Seller Partner
// // // //             </h2>
// // // //             <p className="text-[clamp(0.75rem,1.8vw,0.875rem)] sm:text-[clamp(0.875rem,1.8vw,1rem)] text-blue-100 leading-relaxed flex items-center gap-1.5 sm:gap-2">
// // // //               <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 inline flex-shrink-0" />
// // // //               <span>Join our platform with 3D tile visualization</span>
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* FORM */}
// // // //       <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-5 sm:space-y-6 md:space-y-7">
// // // //         {/* GLOBAL ERROR */}
// // // //         {error && (
// // // //           <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-shake">
// // // //             <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
// // // //             <span className="text-red-900 text-[clamp(0.813rem,2vw,0.938rem)] sm:text-[clamp(0.875rem,2vw,1rem)] font-semibold leading-relaxed">
// // // //               {error}
// // // //             </span>
// // // //           </div>
// // // //         )}

// // // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
// // // //           {/* BUSINESS NAME */}
// // // //           <div className="md:col-span-2">
// // // //             <InputField
// // // //               label="Business Name"
// // // //               icon={Store}
// // // //               value={formData.businessName}
// // // //               onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('businessName', e.target.value)}
// // // //               placeholder="ABC Tiles & Ceramics Pvt Ltd"
// // // //               error={businessNameError}
// // // //               checkMessage={businessNameCheckMessage}
// // // //               checking={checkingBusinessName}
// // // //               exists={businessNameExists}
// // // //               required
// // // //             />
// // // //           </div>

// // // //           {/* OWNER NAME */}
// // // //           <div>
// // // //             <InputField
// // // //               label="Owner Name"
// // // //               icon={User}
// // // //               value={formData.ownerName}
// // // //               onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('ownerName', e.target.value)}
// // // //               placeholder="Rajesh Kumar"
// // // //               error={nameError}
// // // //               required
// // // //             />
// // // //           </div>

// // // //           {/* EMAIL */}
// // // //           <div>
// // // //             <InputField
// // // //               label="Business Email"
// // // //               icon={Mail}
// // // //               type="email"
// // // //               value={formData.email}
// // // //               onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
// // // //               placeholder="business@gmail.com"
// // // //               error={emailError}
// // // //               checkMessage={emailCheckMessage}
// // // //               checking={checkingEmail}
// // // //               exists={emailExists}
// // // //               required
// // // //               description="Must be valid (e.g., name@gmail.com)"
// // // //             />
            
// // // //             {/* TYPO SUGGESTION */}
// // // //             {domainSuggestion && (
// // // //               <div className="mt-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 shadow-lg animate-bounce-subtle">
// // // //                 <p className="text-red-900 text-[clamp(0.75rem,1.8vw,0.875rem)] sm:text-[clamp(0.875rem,1.8vw,1rem)] font-bold mb-2 leading-tight">
// // // //                   ❌ Invalid Email Domain Detected!
// // // //                 </p>
// // // //                 <p className="text-red-800 text-[clamp(0.688rem,1.6vw,0.813rem)] sm:text-[clamp(0.813rem,1.6vw,0.938rem)] font-semibold mb-3 leading-relaxed">
// // // //                   <span className="block mb-1">You typed: <strong className="text-red-950">{formData.email}</strong></span>
// // // //                   <span className="block">Did you mean: <strong className="text-green-700">{domainSuggestion}</strong>?</span>
// // // //                 </p>
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={useSuggestedEmail}
// // // //                   className="w-full text-[clamp(0.75rem,1.8vw,0.875rem)] sm:text-[clamp(0.875rem,1.8vw,1rem)] bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
// // // //                 >
// // // //                   ✅ Use Correct Email: {domainSuggestion}
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* PHONE */}
// // // //           <div className="md:col-span-2">
// // // //             <InputField
// // // //               label="Phone Number"
// // // //               icon={Phone}
// // // //               type="tel"
// // // //               value={formData.phone}
// // // //               onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
// // // //               placeholder="9876543210"
// // // //               error={phoneError}
// // // //               checkMessage={phoneCheckMessage}
// // // //               checking={checkingPhone}
// // // //               exists={phoneExists}
// // // //               maxLength={10}
// // // //               required
// // // //             />
// // // //           </div>
// // // //         </div>
        
// // // //         {/* ADDRESS */}
// // // //         <div>
// // // //           <InputField
// // // //             label="Business Address"
// // // //             icon={MapPin}
// // // //             type="textarea"
// // // //             value={formData.businessAddress}
// // // //             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('businessAddress', e.target.value)}
// // // //             placeholder="Shop 123, ABC Market, XYZ City, State - 123456"
// // // //             rows={3}
// // // //             required
// // // //           />
// // // //         </div>
        
// // // //         {/* ADDITIONAL INFO */}
// // // //         <div>
// // // //           <InputField
// // // //             label="Additional Info (Optional)"
// // // //             type="textarea"
// // // //             value={formData.additionalInfo}
// // // //             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('additionalInfo', e.target.value)}
// // // //             placeholder="Years in business, certifications, etc."
// // // //             rows={3}
// // // //           />
// // // //         </div>

// // // //         {/* SUBMIT BUTTON */}
// // // //         <button
// // // //           type="submit"
// // // //           disabled={
// // // //             submitting || 
// // // //             checkingEmail || 
// // // //             checkingPhone ||
// // // //             emailExists || 
// // // //             phoneExists ||
// // // //             !!emailError || 
// // // //             !!phoneError || 
// // // //             !!nameError ||
// // // //             !!businessNameError ||
// // // //             !!domainSuggestion
// // // //           }
// // // //           className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 sm:gap-3 font-bold text-[clamp(1rem,2.5vw,1.125rem)] sm:text-[clamp(1.125rem,2.5vw,1.25rem)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-xl hover:shadow-2xl relative overflow-hidden group"
// // // //         >
// // // //           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
// // // //           <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
// // // //             {submitting ? (
// // // //               <>
// // // //                 <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
// // // //                 <span>Submitting...</span>
// // // //               </>
// // // //             ) : checkingEmail || checkingPhone ? (
// // // //               <>
// // // //                 <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
// // // //                 <span>Verifying...</span>
// // // //               </>
// // // //             ) : emailExists || phoneExists ? (
// // // //               <span>❌ Duplicate Data</span>
// // // //             ) : domainSuggestion ? (
// // // //               <span>❌ Fix Email Domain First</span>
// // // //             ) : (
// // // //               <>
// // // //                 <Send className="w-5 h-5 sm:w-6 sm:h-6" />
// // // //                 <span>Submit Request</span>
// // // //               </>
// // // //             )}
// // // //           </span>
// // // //         </button>

// // // //         {/* STATUS */}
// // // //         <div className="text-center text-[clamp(0.875rem,2vw,1rem)] sm:text-[clamp(1rem,2vw,1.125rem)] font-semibold">
// // // //           {(checkingEmail || checkingPhone) && (
// // // //             <p className="text-blue-700 animate-pulse">🔍 Verifying data...</p>
// // // //           )}
// // // //           {domainSuggestion && (
// // // //             <p className="text-red-700 animate-pulse">❌ Email domain typo detected - Fix required!</p>
// // // //           )}
// // // //           {(emailExists || phoneExists) && !(checkingEmail || checkingPhone) && (
// // // //             <p className="text-red-700">❌ Duplicate data - Cannot submit</p>
// // // //           )}
// // // //           {!emailExists && !phoneExists && !domainSuggestion && (emailCheckMessage || phoneCheckMessage) && !(checkingEmail || checkingPhone) && !emailError && !phoneError && (
// // // //             <p className="text-green-700">✅ All verified - Ready to submit</p>
// // // //           )}
// // // //         </div>

// // // //         {/* BENEFITS */}
// // // //         <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-blue-300 shadow-lg">
// // // //           <p className="font-bold text-gray-900 mb-4 sm:mb-5 text-[clamp(1rem,2.5vw,1.25rem)] sm:text-[clamp(1.125rem,2.5vw,1.375rem)] flex items-center gap-2 sm:gap-3">
// // // //             <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
// // // //             <span>Why Join Our Platform?</span>
// // // //           </p>
          
// // // //           <ul className="space-y-3 sm:space-y-4 text-[clamp(0.813rem,2vw,0.938rem)] sm:text-[clamp(0.938rem,2vw,1.063rem)] text-gray-700">
// // // //             <li className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/70 transition-all duration-200 group">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">✓</span>
// // // //               <span className="leading-relaxed"><strong className="text-gray-900">3D Visualization</strong> - Customers see tiles in their space</span>
// // // //             </li>
// // // //             <li className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/70 transition-all duration-200 group">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">✓</span>
// // // //               <span className="leading-relaxed"><strong className="text-gray-900">Analytics Dashboard</strong> - Track performance</span>
// // // //             </li>
// // // //             <li className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/70 transition-all duration-200 group">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">✓</span>
// // // //               <span className="leading-relaxed"><strong className="text-gray-900">QR Integration</strong> - Connect physical & digital</span>
// // // //             </li>
// // // //             <li className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/70 transition-all duration-200 group">
// // // //               <span className="text-green-600 font-bold text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">✓</span>
// // // //               <span className="leading-relaxed"><strong className="text-gray-900">Wider Reach</strong> - Access thousands of customers</span>
// // // //             </li>
// // // //           </ul>
// // // //         </div>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // }; 
// // // import React, { useState, useEffect, useRef, memo } from 'react';
// // // import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// // // import { db } from '../lib/firebase';

// // // interface FormData {
// // //   businessName: string;
// // //   businessType: string;
// // //   ownerName: string;
// // //   phone: string;
// // //   businessAddress: string;
// // //   city: string;
// // //   state: string;
// // //   pincode: string;
// // //   email: string;
// // //   numberOfBranches: string;
// // //   additionalInfo: string;
// // // }

// // // // Material Icons Component
// // // const MaterialIcon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
// // //   <span 
// // //     className={`material-symbols-outlined ${className}`}
// // //     style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
// // //   >
// // //     {name}
// // //   </span>
// // // );

// // // // Memoized Input Component
// // // const InputField = memo(({ 
// // //   label, 
// // //   icon,
// // //   type = 'text',
// // //   value, 
// // //   onChange, 
// // //   placeholder, 
// // //   error, 
// // //   checkMessage,
// // //   checking,
// // //   exists,
// // //   required = false,
// // //   maxLength,
// // //   options,
// // //   description
// // // }: any) => {
// // //   const isSelect = type === 'select';
  
// // //   return (
// // //     <div className="space-y-2">
// // //       <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
// // //         {label} {required && '*'}
// // //       </label>
      
// // //       {description && (
// // //         <p className="text-xs text-red-600 font-medium">{description}</p>
// // //       )}
      
// // //       <div className="relative">
// // //         {isSelect ? (
// // //           <select
// // //             value={value}
// // //             onChange={onChange}
// // //             className="w-full px-4 py-3 bg-surface rounded-xl border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all outline-none text-body-md appearance-none cursor-pointer"
// // //             required={required}
// // //           >
// // //             {options?.map((opt: string) => (
// // //               <option key={opt} value={opt}>{opt}</option>
// // //             ))}
// // //           </select>
// // //         ) : (
// // //           <input
// // //             type={type}
// // //             value={value}
// // //             onChange={onChange}
// // //             className={`
// // //               w-full px-4 py-3 rounded-xl border-none ring-1 transition-all outline-none text-body-md
// // //               ${error 
// // //                 ? 'ring-2 ring-red-500 bg-red-50' 
// // //                 : exists
// // //                 ? 'ring-2 ring-red-500 bg-red-50'
// // //                 : checking
// // //                 ? 'ring-2 ring-blue-500 bg-blue-50 animate-pulse'
// // //                 : checkMessage && !error
// // //                 ? 'ring-2 ring-green-500 bg-green-50'
// // //                 : 'ring-outline-variant focus:ring-2 focus:ring-primary bg-surface'
// // //               }
// // //             `}
// // //             placeholder={placeholder}
// // //             required={required}
// // //             maxLength={maxLength}
// // //           />
// // //         )}
        
// // //         {!isSelect && (checking || checkMessage) && (
// // //           <div className="absolute right-3 top-1/2 -translate-y-1/2">
// // //             {checking && (
// // //               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
// // //             )}
// // //             {!checking && checkMessage && !exists && !error && (
// // //               <MaterialIcon name="check_circle" filled className="text-green-600 text-2xl" />
// // //             )}
// // //             {!checking && exists && (
// // //               <MaterialIcon name="cancel" filled className="text-red-600 text-2xl" />
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
      
// // //       {error && (
// // //         <p className="text-red-600 text-sm font-medium flex items-start gap-1.5">
// // //           <MaterialIcon name="error" className="text-lg" />
// // //           <span>{error}</span>
// // //         </p>
// // //       )}
      
// // //       {checkMessage && !error && (
// // //         <p className={`text-sm font-medium ${checking ? 'text-blue-700' : exists ? 'text-red-700' : 'text-green-700'}`}>
// // //           {checkMessage}
// // //         </p>
// // //       )}
// // //     </div>
// // //   );
// // // });

// // // InputField.displayName = 'InputField';

// // // export const SellerRequestForm: React.FC = () => {
// // //   const [formData, setFormData] = useState<FormData>(() => {
// // //     const saved = localStorage.getItem('sellerRequestDraft');
// // //     if (saved) {
// // //       try {
// // //         return JSON.parse(saved);
// // //       } catch {
// // //         return {
// // //           businessName: '',
// // //           businessType: 'Tile Showroom',
// // //           ownerName: '',
// // //           phone: '',
// // //           businessAddress: '',
// // //           city: '',
// // //           state: '',
// // //           pincode: '',
// // //           email: '',
// // //           numberOfBranches: '1',
// // //           additionalInfo: ''
// // //         };
// // //       }
// // //     }
// // //     return {
// // //       businessName: '',
// // //       businessType: 'Tile Showroom',
// // //       ownerName: '',
// // //       phone: '',
// // //       businessAddress: '',
// // //       city: '',
// // //       state: '',
// // //       pincode: '',
// // //       email: '',
// // //       numberOfBranches: '1',
// // //       additionalInfo: ''
// // //     };
// // //   });

// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [submitted, setSubmitted] = useState(false);
// // //   const [error, setError] = useState('');
  
// // //   const [emailError, setEmailError] = useState('');
// // //   const [phoneError, setPhoneError] = useState('');
// // //   const [nameError, setNameError] = useState('');
// // //   const [businessNameError, setBusinessNameError] = useState('');
// // //   const [pincodeError, setPincodeError] = useState('');
// // //   const [domainSuggestion, setDomainSuggestion] = useState('');

// // //   const [checkingEmail, setCheckingEmail] = useState(false);
// // //   const [emailExists, setEmailExists] = useState(false);
// // //   const [emailCheckMessage, setEmailCheckMessage] = useState('');
  
// // //   const [checkingPhone, setCheckingPhone] = useState(false);
// // //   const [phoneExists, setPhoneExists] = useState(false);
// // //   const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

// // //   const [checkingBusinessName, setCheckingBusinessName] = useState(false);
// // //   const [businessNameExists, setBusinessNameExists] = useState(false);
// // //   const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState('');
  
// // //   const lastCheckedEmail = useRef('');
// // //   const lastCheckedPhone = useRef('');
// // //   const lastCheckedBusinessName = useRef('');
// // //   const checkInProgress = useRef(false);
// // //   const lastSubmitTime = useRef(0);
// // //   const SUBMIT_COOLDOWN = 5000;

// // //   // Validation Functions
// // //   const validateEmail = (email: string): boolean => {
// // //     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// // //     if (!regex.test(email)) return false;
// // //     const parts = email.split('@');
// // //     if (parts.length !== 2) return false;
// // //     if (parts[0].length === 0 || parts[1].length === 0) return false;
// // //     if (!parts[1].includes('.')) return false;
// // //     return true;
// // //   };

// // //   const validateEmailDomain = (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
// // //     const commonTypos: Record<string, string> = {
// // //       'gmali.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
// // //       'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmial.com': 'gmail.com',
// // //       'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahho.com': 'yahoo.com',
// // //       'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
// // //       'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com'
// // //     };
    
// // //     const parts = email.split('@');
// // //     if (parts.length !== 2) return { isValid: false, hasTypo: false };
    
// // //     const domain = parts[1]?.toLowerCase();
// // //     if (!domain) return { isValid: false, hasTypo: false };
    
// // //     if (commonTypos[domain]) {
// // //       return { isValid: false, suggestion: parts[0] + '@' + commonTypos[domain], hasTypo: true };
// // //     }
    
// // //     return { isValid: true, hasTypo: false };
// // //   };

// // //   const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
// // //     const cleaned = phone.replace(/\D/g, '');
// // //     if (!cleaned) return { isValid: false, error: 'Phone number required' };
// // //     if (cleaned.length !== 10) return { isValid: false, error: 'Must be exactly 10 digits' };
// // //     if (!/^[6-9]/.test(cleaned)) return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
// // //     return { isValid: true };
// // //   };

// // //   const validatePincode = (pincode: string): { isValid: boolean; error?: string } => {
// // //     const cleaned = pincode.replace(/\D/g, '');
// // //     if (!cleaned) return { isValid: false, error: 'Pincode required' };
// // //     if (cleaned.length !== 6) return { isValid: false, error: 'Must be 6 digits' };
// // //     return { isValid: true };
// // //   };

// // //   const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
// // //     if (!name.trim()) return { isValid: false, error: 'Owner name required' };
// // //     if (name.trim().length < 2) return { isValid: false, error: 'At least 2 characters required' };
// // //     if (/\d/.test(name)) return { isValid: false, error: 'Cannot contain numbers' };
// // //     if (!/^[a-zA-Z\s]+$/.test(name)) return { isValid: false, error: 'Only letters and spaces allowed' };
// // //     return { isValid: true };
// // //   };

// // //   const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
// // //     if (!name.trim()) return { isValid: false, error: 'Business name required' };
// // //     if (name.trim().length < 3) return { isValid: false, error: 'At least 3 characters required' };
// // //     if (name.trim().length > 100) return { isValid: false, error: 'Maximum 100 characters allowed' };
// // //     return { isValid: true };
// // //   };

// // //   // Database Check Functions
// // //   const checkEmailExists = async (email: string): Promise<boolean> => {
// // //     if (checkInProgress.current || !email || !validateEmail(email)) return false;

// // //     const domainCheck = validateEmailDomain(email);
// // //     if (domainCheck.hasTypo && domainCheck.suggestion) {
// // //       setDomainSuggestion(domainCheck.suggestion);
// // //       setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
// // //       setEmailExists(false);
// // //       setEmailCheckMessage('❌ Invalid domain');
// // //       return false;
// // //     } else {
// // //       setDomainSuggestion('');
// // //     }

// // //     checkInProgress.current = true;
// // //     setCheckingEmail(true);
// // //     setEmailCheckMessage('🔍 Checking...');

// // //     try {
// // //       const emailToCheck = email.toLowerCase().trim();

// // //       const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
// // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // //       if (sellersSnapshot.size > 0) {
// // //         setEmailExists(true);
// // //         setEmailCheckMessage('❌ Already registered');
// // //         setEmailError('Email already registered');
// // //         setCheckingEmail(false);
// // //         checkInProgress.current = false;
// // //         lastCheckedEmail.current = emailToCheck;
// // //         return true;
// // //       }

// // //       const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
// // //       const requestsSnapshot = await getDocs(requestsQuery);
      
// // //       if (requestsSnapshot.size > 0) {
// // //         const status = requestsSnapshot.docs[0].data().status;
// // //         if (status === 'pending') {
// // //           setEmailExists(true);
// // //           setEmailCheckMessage('⏳ Request pending');
// // //           setEmailError('Request already pending');
// // //         } else if (status === 'approved') {
// // //           setEmailExists(true);
// // //           setEmailCheckMessage('✅ Already approved');
// // //           setEmailError('Account already exists');
// // //         } else {
// // //           setEmailExists(false);
// // //           setEmailCheckMessage('⚠️ Can reapply');
// // //           setEmailError('');
// // //         }
// // //         setCheckingEmail(false);
// // //         checkInProgress.current = false;
// // //         lastCheckedEmail.current = emailToCheck;
// // //         return status === 'pending' || status === 'approved';
// // //       }

// // //       setEmailExists(false);
// // //       setEmailCheckMessage('✅ Available');
// // //       setEmailError('');
// // //       setCheckingEmail(false);
// // //       checkInProgress.current = false;
// // //       lastCheckedEmail.current = emailToCheck;
// // //       return false;

// // //     } catch (error) {
// // //       console.error('Email check error:', error);
// // //       setEmailCheckMessage('⚠️ Check failed');
// // //       setEmailExists(false);
// // //       setCheckingEmail(false);
// // //       checkInProgress.current = false;
// // //       return false;
// // //     }
// // //   };

// // //   const checkPhoneExists = async (phone: string): Promise<boolean> => {
// // //     const cleaned = phone.replace(/\D/g, '');
// // //     if (!cleaned || cleaned.length !== 10) return false;
// // //     if (lastCheckedPhone.current === cleaned) return phoneExists;

// // //     setCheckingPhone(true);
// // //     setPhoneCheckMessage('🔍 Checking...');

// // //     try {
// // //       const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
// // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // //       if (sellersSnapshot.size > 0) {
// // //         setPhoneExists(true);
// // //         setPhoneCheckMessage('❌ Already registered');
// // //         setPhoneError('Phone already in use');
// // //         setCheckingPhone(false);
// // //         lastCheckedPhone.current = cleaned;
// // //         return true;
// // //       }

// // //       const requestsQuery = query(collection(db, 'sellerRequests'), where('phone', '==', cleaned));
// // //       const requestsSnapshot = await getDocs(requestsQuery);
      
// // //       if (requestsSnapshot.size > 0) {
// // //         const status = requestsSnapshot.docs[0].data().status;
// // //         if (status === 'pending' || status === 'approved') {
// // //           setPhoneExists(true);
// // //           setPhoneCheckMessage('❌ Phone in use');
// // //           setPhoneError('Phone already registered');
// // //           setCheckingPhone(false);
// // //           lastCheckedPhone.current = cleaned;
// // //           return true;
// // //         }
// // //       }

// // //       setPhoneExists(false);
// // //       setPhoneCheckMessage('✅ Available');
// // //       setPhoneError('');
// // //       setCheckingPhone(false);
// // //       lastCheckedPhone.current = cleaned;
// // //       return false;

// // //     } catch (error) {
// // //       console.error('Phone check error:', error);
// // //       setPhoneCheckMessage('');
// // //       setPhoneExists(false);
// // //       setCheckingPhone(false);
// // //       return false;
// // //     }
// // //   };

// // //   const checkBusinessNameExists = async (name: string): Promise<boolean> => {
// // //     const normalized = name.toLowerCase().trim();
// // //     if (!normalized || normalized.length < 3) return false;
// // //     if (lastCheckedBusinessName.current === normalized) return businessNameExists;

// // //     setCheckingBusinessName(true);
// // //     setBusinessNameCheckMessage('🔍 Checking...');

// // //     try {
// // //       const sellersQuery = query(collection(db, 'sellers'), where('businessName', '==', normalized));
// // //       const sellersSnapshot = await getDocs(sellersQuery);
      
// // //       if (sellersSnapshot.size > 0) {
// // //         setBusinessNameExists(true);
// // //         setBusinessNameCheckMessage('⚠️ Similar name exists');
// // //         setBusinessNameError('Consider using a unique name');
// // //         setCheckingBusinessName(false);
// // //         lastCheckedBusinessName.current = normalized;
// // //         return true;
// // //       }

// // //       setBusinessNameExists(false);
// // //       setBusinessNameCheckMessage('✅ Unique');
// // //       setBusinessNameError('');
// // //       setCheckingBusinessName(false);
// // //       lastCheckedBusinessName.current = normalized;
// // //       return false;

// // //     } catch (error) {
// // //       console.error('Business name check error:', error);
// // //       setBusinessNameCheckMessage('');
// // //       setBusinessNameExists(false);
// // //       setCheckingBusinessName(false);
// // //       return false;
// // //     }
// // //   };

// // //   // Debounced Checks
// // //   useEffect(() => {
// // //     if (!formData.email) {
// // //       setEmailExists(false);
// // //       setEmailCheckMessage('');
// // //       setEmailError('');
// // //       setDomainSuggestion('');
// // //       return;
// // //     }

// // //     if (!validateEmail(formData.email)) {
// // //       setEmailExists(false);
// // //       setEmailCheckMessage('');
// // //       if (!formData.email.includes('@')) setEmailError('Email must contain @');
// // //       return;
// // //     }

// // //     if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) return;

// // //     const timer = setTimeout(() => {
// // //       checkEmailExists(formData.email);
// // //     }, 800);

// // //     return () => clearTimeout(timer);
// // //   }, [formData.email]);

// // //   useEffect(() => {
// // //     const cleaned = formData.phone.replace(/\D/g, '');
// // //     if (!cleaned || cleaned.length !== 10) {
// // //       setPhoneExists(false);
// // //       setPhoneCheckMessage('');
// // //       return;
// // //     }

// // //     if (lastCheckedPhone.current === cleaned) return;

// // //     const timer = setTimeout(() => {
// // //       checkPhoneExists(formData.phone);
// // //     }, 1000);

// // //     return () => clearTimeout(timer);
// // //   }, [formData.phone]);

// // //   useEffect(() => {
// // //     const normalized = formData.businessName.toLowerCase().trim();
// // //     if (!normalized || normalized.length < 3) {
// // //       setBusinessNameExists(false);
// // //       setBusinessNameCheckMessage('');
// // //       return;
// // //     }

// // //     if (lastCheckedBusinessName.current === normalized) return;

// // //     const timer = setTimeout(() => {
// // //       checkBusinessNameExists(formData.businessName);
// // //     }, 1000);

// // //     return () => clearTimeout(timer);
// // //   }, [formData.businessName]);

// // //   // Save to localStorage
// // //   useEffect(() => {
// // //     if (!submitted) {
// // //       const timer = setTimeout(() => {
// // //         localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
// // //       }, 500);
// // //       return () => clearTimeout(timer);
// // //     }
// // //   }, [formData, submitted]);

// // //   useEffect(() => {
// // //     if (submitted) {
// // //       localStorage.removeItem('sellerRequestDraft');
// // //     }
// // //   }, [submitted]);

// // //   // Input Change Handler
// // //   const handleInputChange = (field: keyof FormData, value: string) => {
// // //     setFormData(prev => ({ ...prev, [field]: value }));
    
// // //     if (error) setError('');
    
// // //     if (field === 'email') {
// // //       setEmailCheckMessage('');
// // //       setEmailExists(false);
// // //       setDomainSuggestion('');
// // //       lastCheckedEmail.current = '';
// // //       if (emailError) setEmailError('');
// // //     }
    
// // //     if (field === 'phone') {
// // //       setPhoneCheckMessage('');
// // //       setPhoneExists(false);
// // //       lastCheckedPhone.current = '';
// // //       if (phoneError) setPhoneError('');
// // //       if (value) {
// // //         const validation = validatePhone(value);
// // //         if (!validation.isValid) setPhoneError(validation.error || 'Invalid');
// // //       }
// // //     }
    
// // //     if (field === 'businessName') {
// // //       setBusinessNameCheckMessage('');
// // //       setBusinessNameExists(false);
// // //       lastCheckedBusinessName.current = '';
// // //       if (businessNameError) setBusinessNameError('');
// // //       if (value) {
// // //         const validation = validateBusinessName(value);
// // //         if (!validation.isValid) setBusinessNameError(validation.error || 'Invalid');
// // //       }
// // //     }
    
// // //     if (field === 'ownerName') {
// // //       if (nameError) setNameError('');
// // //       if (value) {
// // //         const validation = validateOwnerName(value);
// // //         if (!validation.isValid) setNameError(validation.error || 'Invalid');
// // //       }
// // //     }

// // //     if (field === 'pincode') {
// // //       if (pincodeError) setPincodeError('');
// // //       if (value) {
// // //         const validation = validatePincode(value);
// // //         if (!validation.isValid) setPincodeError(validation.error || 'Invalid');
// // //       }
// // //     }
// // //   };

// // //   // Use Suggested Email
// // //   const useSuggestedEmail = () => {
// // //     if (domainSuggestion) {
// // //       setFormData(prev => ({ ...prev, email: domainSuggestion }));
// // //       setDomainSuggestion('');
// // //       setEmailError('');
// // //       setEmailCheckMessage('');
// // //       lastCheckedEmail.current = '';
// // //     }
// // //   };

// // //   // Form Validation
// // //   const validateForm = (): boolean => {
// // //     const businessValidation = validateBusinessName(formData.businessName);
// // //     if (!businessValidation.isValid) {
// // //       setBusinessNameError(businessValidation.error || 'Invalid');
// // //       setError('Please fix business name');
// // //       return false;
// // //     }
    
// // //     const nameValidation = validateOwnerName(formData.ownerName);
// // //     if (!nameValidation.isValid) {
// // //       setNameError(nameValidation.error || 'Invalid');
// // //       setError('Please fix owner name');
// // //       return false;
// // //     }
    
// // //     if (!formData.email || !validateEmail(formData.email)) {
// // //       setEmailError('Enter a valid email address');
// // //       setError('Email is required and must be valid');
// // //       return false;
// // //     }

// // //     const domainCheck = validateEmailDomain(formData.email);
// // //     if (domainCheck.hasTypo) {
// // //       setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
// // //       setError(`Email typo detected!`);
// // //       setDomainSuggestion(domainCheck.suggestion || '');
// // //       return false;
// // //     }

// // //     const phoneValidation = validatePhone(formData.phone);
// // //     if (!phoneValidation.isValid) {
// // //       setPhoneError(phoneValidation.error || 'Invalid');
// // //       setError('Please fix phone number');
// // //       return false;
// // //     }

// // //     const pincodeValidation = validatePincode(formData.pincode);
// // //     if (!pincodeValidation.isValid) {
// // //       setPincodeError(pincodeValidation.error || 'Invalid');
// // //       setError('Please fix pincode');
// // //       return false;
// // //     }
    
// // //     if (!formData.businessAddress.trim()) {
// // //       setError('Business address required');
// // //       return false;
// // //     }

// // //     if (!formData.city.trim()) {
// // //       setError('City required');
// // //       return false;
// // //     }

// // //     if (!formData.state.trim()) {
// // //       setError('State required');
// // //       return false;
// // //     }
    
// // //     return true;
// // //   };

// // //   // Form Submit
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     const now = Date.now();
// // //     if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
// // //       const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
// // //       alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
// // //       return;
// // //     }

// // //     if (checkingEmail || checkingPhone || checkInProgress.current) {
// // //       alert('⏳ Please wait! Email/Phone verification in progress.');
// // //       return;
// // //     }

// // //     if (domainSuggestion) {
// // //       alert(`❌ Invalid Email Domain!\n\nPlease use: ${domainSuggestion}`);
// // //       return;
// // //     }

// // //     if (!validateForm()) return;

// // //     setSubmitting(true);
// // //     setError('Final verification...');

// // //     try {
// // //       const emailIsRegistered = await checkEmailExists(formData.email);
// // //       if (emailIsRegistered) {
// // //         setError('❌ Email already registered');
// // //         alert('❌ Email Already Registered!');
// // //         setSubmitting(false);
// // //         return;
// // //       }

// // //       const phoneIsRegistered = await checkPhoneExists(formData.phone);
// // //       if (phoneIsRegistered) {
// // //         setError('❌ Phone already registered');
// // //         alert('❌ Phone Already Registered!');
// // //         setSubmitting(false);
// // //         return;
// // //       }

// // //       setError('');
// // //     } catch (err) {
// // //       console.error('Verification error:', err);
// // //       setError('Verification failed. Try again.');
// // //       setSubmitting(false);
// // //       return;
// // //     }

// // //     if (emailExists || phoneExists) {
// // //       alert('❌ Cannot Submit! Duplicate data found.');
// // //       setSubmitting(false);
// // //       return;
// // //     }

// // //     try {
// // //       await addDoc(collection(db, 'sellerRequests'), {
// // //         businessName: formData.businessName.trim(),
// // //         businessType: formData.businessType,
// // //         ownerName: formData.ownerName.trim(),
// // //         email: formData.email.toLowerCase().trim(),
// // //         phone: formData.phone.replace(/\D/g, ''),
// // //         businessAddress: formData.businessAddress.trim(),
// // //         city: formData.city.trim(),
// // //         state: formData.state.trim(),
// // //         pincode: formData.pincode.replace(/\D/g, ''),
// // //         numberOfBranches: formData.numberOfBranches,
// // //         additionalInfo: formData.additionalInfo.trim() || null,
// // //         status: 'pending',
// // //         requestedAt: new Date().toISOString(),
// // //         adminNotes: null,
// // //         reviewedAt: null,
// // //         reviewedBy: null,
// // //         emailDeliveryStatus: null,
// // //         accountCreated: false
// // //       });

// // //       lastSubmitTime.current = Date.now();
// // //       setSubmitted(true);
      
// // //     } catch (err: any) {
// // //       console.error('Firestore error:', err);
// // //       if (err.code === 'permission-denied') {
// // //         setError('❌ Permission denied. Contact support.');
// // //       } else {
// // //         setError('❌ Submission failed. Try again.');
// // //       }
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // Success Screen
// // //   if (submitted) {
// // //     return (
// // //       <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
// // //         <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border-2 border-green-400">
// // //           <div className="mb-6">
// // //             <MaterialIcon name="check_circle" filled className="text-green-600 text-8xl mx-auto animate-bounce" />
// // //           </div>
          
// // //           <h3 className="text-4xl font-bold text-green-800 mb-4">
// // //             ✅ Request Submitted Successfully!
// // //           </h3>
          
// // //           <p className="text-xl text-green-700 mb-8">
// // //             Thank you <strong>{formData.ownerName}</strong>!
// // //           </p>
          
// // //           <div className="bg-gray-50 rounded-2xl p-8 text-left border-2 border-gray-200">
// // //             <h4 className="font-bold text-gray-900 mb-5 text-xl flex items-center gap-3">
// // //               <MaterialIcon name="info" filled className="text-blue-600 text-3xl" />
// // //               What's Next?
// // //             </h4>
            
// // //             <ul className="space-y-4 text-gray-700">
// // //               <li className="flex items-start gap-3">
// // //                 <MaterialIcon name="schedule" filled className="text-green-600 text-2xl flex-shrink-0" />
// // //                 <span>Review in <strong>2-3 business days</strong></span>
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <MaterialIcon name="mail" filled className="text-green-600 text-2xl flex-shrink-0" />
// // //                 <span className="break-all">Updates to: <strong>{formData.email}</strong></span>
// // //               </li>
// // //               <li className="flex items-start gap-3">
// // //                 <MaterialIcon name="verified" filled className="text-green-600 text-2xl flex-shrink-0" />
// // //                 <span>Login credentials if <strong>approved</strong></span>
// // //               </li>
// // //             </ul>
// // //           </div>
          
// // //           <div className="mt-8 bg-gray-100 rounded-xl p-5 inline-block">
// // //             <p className="text-sm text-gray-600 mb-2">Reference ID</p>
// // //             <p className="text-2xl font-mono font-bold text-gray-900">
// // //               REQ-{Date.now().toString().slice(-8)}
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Main Form UI
// // //   return (
// // //     <div className="min-h-screen bg-background">
// // //       {/* Navigation Bar */}
// // //       <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
// // //         <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 md:px-16 h-20">
// // //           <div className="flex items-center gap-4">
// // //             <img 
// // //               alt="VirtuThings Logo" 
// // //               className="h-10 w-auto" 
// // //               src="https://lh3.googleusercontent.com/aida/AP1WRLvyx1wURSmrzX5ul0t2vQ8aBshaKymLVrexE8a4wVcx7hE9IjLaMZUqPTDdznaHSBwK3XvURG2nIW_zkma-oYS7AFEV_KYVZkBQP3P-cMYs1tv0s-NQw1jqjIpkRV0Zpvm6Fl61U61IBgbrmJICuaM1CBBfVuRq2VDVgK4WkFLCzLbOp80V9UwxJR66L5b_C9ZUelWeuQX9OayYAEjrcKahWVuG3N5HETtk-_q-GjJ71l_PmCcid1dYCYS8"
// // //             />
// // //             <span className="text-2xl font-bold tracking-tighter text-primary">Tilesview360</span>
// // //           </div>
// // //           <div className="hidden md:flex items-center gap-8">
// // //             <a className="font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Platform</a>
// // //             <a className="font-medium text-primary border-b-2 border-primary pb-1" href="#">Partners</a>
// // //             <a className="font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Showcase</a>
// // //             <a className="font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Pricing</a>
// // //           </div>
// // //           <div className="flex items-center gap-4">
// // //             <button className="hidden sm:block px-6 py-2.5 text-sm font-semibold uppercase text-on-surface-variant hover:bg-primary-container/10 rounded-lg transition-all">
// // //               Support
// // //             </button>
// // //             <button className="px-6 py-2.5 bg-primary text-white text-sm font-semibold uppercase rounded-lg hover:scale-105 shadow-lg transition-all">
// // //               Sign In
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       <main className="pt-20">
// // //         {/* Hero Section */}
// // //         <section className="relative min-h-[60vh] flex items-center overflow-hidden">
// // //           <div className="absolute inset-0 z-0">
// // //             <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10"></div>
// // //             <div 
// // //               className="w-full h-full bg-cover bg-center opacity-30" 
// // //               style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAroFBavzMYbVtTnj6guHgLgiyRbS4brV2u8LcZRQIewhnEoEWX-C1xnGPMUyOGA_zhWpDcCV_c4lZtco2thvCgItp-fZZOncdfueG4x-CyWT6kd0vIAU6sUE5-hLla2x2-te7Ohikf83acy5pr4_sQRWLe-4_Acr5geqgmLQTrKNEqahOlu4vVSxq-6flte9fsSJ0xBvmnduC6LSX1L8trOUIFTYv46Oyx080w0vIn9uu-7WBvva6OQMA0RI-Ez8-Qv7ebcagl4WKg')" }}
// // //             />
// // //           </div>
// // //           <div className="container mx-auto px-6 md:px-16 relative z-20 py-8">
// // //             <div className="max-w-3xl">
// // //               <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter text-on-surface mb-6">
// // //                 Transform Your Tile Showroom Into a <span className="text-primary">Smart Experience</span>
// // //               </h1>
// // //               <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
// // //                 Help customers visualize every tile before they buy, increase confidence, and close more sales with AI-powered 3D visualization.
// // //               </p>
// // //               <div className="flex flex-wrap gap-6">
// // //                 <div className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl">
// // //                   <MaterialIcon name="store" filled className="text-primary" />
// // //                   <span className="text-sm font-bold uppercase">Trusted by Dealers</span>
// // //                 </div>
// // //                 <div className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl">
// // //                   <MaterialIcon name="view_in_ar" filled className="text-secondary" />
// // //                   <span className="text-sm font-bold uppercase">Realistic 3D Preview</span>
// // //                 </div>
// // //                 <div className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl">
// // //                   <MaterialIcon name="qr_code_2" filled className="text-primary" />
// // //                   <span className="text-sm font-bold uppercase">QR Powered Catalog</span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* Form & Features Section */}
// // //         <section className="py-24 bg-surface-container-lowest">
// // //           <div className="container mx-auto px-6 md:px-16">
// // //             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
// // //               {/* LEFT: FORM */}
// // //               <div className="lg:col-span-7">
// // //                 <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl">
// // //                   <div className="mb-10 p-4 bg-primary/10 border-l-4 border-primary rounded-lg">
// // //                     <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
// // //                       Become a <span className="text-primary">Tilesview360 Partner</span>
// // //                     </h2>
// // //                   </div>

// // //                   {error && (
// // //                     <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-xl flex items-start gap-3">
// // //                       <MaterialIcon name="error" className="text-red-600 text-2xl flex-shrink-0" />
// // //                       <span className="text-red-900 font-semibold">{error}</span>
// // //                     </div>
// // //                   )}

// // //                   <form onSubmit={handleSubmit} className="space-y-6">
// // //                     {/* Business Name & Type */}
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                       <InputField
// // //                         label="Business Name"
// // //                         value={formData.businessName}
// // //                         onChange={(e: any) => handleInputChange('businessName', e.target.value)}
// // //                         placeholder="Enter your business name"
// // //                         error={businessNameError}
// // //                         checkMessage={businessNameCheckMessage}
// // //                         checking={checkingBusinessName}
// // //                         exists={businessNameExists}
// // //                         required
// // //                       />
// // //                       <InputField
// // //                         label="Business Type"
// // //                         type="select"
// // //                         value={formData.businessType}
// // //                         onChange={(e: any) => handleInputChange('businessType', e.target.value)}
// // //                         options={['Tile Showroom', 'Tile Distributor', 'Tile Manufacturer', 'Builder', 'Interior Studio']}
// // //                       />
// // //                     </div>

// // //                     {/* Owner Name & Contact */}
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                       <InputField
// // //                         label="Owner Name"
// // //                         value={formData.ownerName}
// // //                         onChange={(e: any) => handleInputChange('ownerName', e.target.value)}
// // //                         placeholder="Full name of owner"
// // //                         error={nameError}
// // //                       />
// // //                       <InputField
// // //                         label="Contact Number"
// // //                         type="tel"
// // //                         value={formData.phone}
// // //                         onChange={(e: any) => handleInputChange('phone', e.target.value)}
// // //                         placeholder="9876543210"
// // //                         error={phoneError}
// // //                         checkMessage={phoneCheckMessage}
// // //                         checking={checkingPhone}
// // //                         exists={phoneExists}
// // //                         maxLength={10}
// // //                         required
// // //                       />
// // //                     </div>

// // //                     {/* Business Address */}
// // //                     <InputField
// // //                       label="Business Address"
// // //                       value={formData.businessAddress}
// // //                       onChange={(e: any) => handleInputChange('businessAddress', e.target.value)}
// // //                       placeholder="Showroom street address"
// // //                       required
// // //                     />

// // //                     {/* City, State, Pincode */}
// // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //                       <InputField
// // //                         label="City"
// // //                         value={formData.city}
// // //                         onChange={(e: any) => handleInputChange('city', e.target.value)}
// // //                         placeholder="City"
// // //                         required
// // //                       />
// // //                       <InputField
// // //                         label="State"
// // //                         value={formData.state}
// // //                         onChange={(e: any) => handleInputChange('state', e.target.value)}
// // //                         placeholder="State"
// // //                         required
// // //                       />
// // //                       <InputField
// // //                         label="Pincode"
// // //                         value={formData.pincode}
// // //                         onChange={(e: any) => handleInputChange('pincode', e.target.value)}
// // //                         placeholder="123456"
// // //                         error={pincodeError}
// // //                         maxLength={6}
// // //                         required
// // //                       />
// // //                     </div>

// // //                     {/* Email & Branches */}
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                       <InputField
// // //                         label="Business Email"
// // //                         type="email"
// // //                         value={formData.email}
// // //                         onChange={(e: any) => handleInputChange('email', e.target.value)}
// // //                         placeholder="contact@business.com"
// // //                         error={emailError}
// // //                         checkMessage={emailCheckMessage}
// // //                         checking={checkingEmail}
// // //                         exists={emailExists}
// // //                         required
// // //                         description="Must be valid (e.g., name@gmail.com)"
// // //                       />
// // //                       <InputField
// // //                         label="Number of Branches"
// // //                         type="select"
// // //                         value={formData.numberOfBranches}
// // //                         onChange={(e: any) => handleInputChange('numberOfBranches', e.target.value)}
// // //                         options={['1', '2–5', '5+']}
// // //                       />
// // //                     </div>

// // //                     {/* Domain Suggestion */}
// // //                     {domainSuggestion && (
// // //                       <div className="p-4 rounded-xl bg-red-50 border-2 border-red-400">
// // //                         <p className="text-red-900 font-bold mb-2">❌ Invalid Email Domain!</p>
// // //                         <p className="text-red-800 text-sm mb-3">
// // //                           You typed: <strong>{formData.email}</strong><br />
// // //                           Did you mean: <strong className="text-green-700">{domainSuggestion}</strong>?
// // //                         </p>
// // //                         <button
// // //                           type="button"
// // //                           onClick={useSuggestedEmail}
// // //                           className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-bold"
// // //                         >
// // //                           ✅ Use {domainSuggestion}
// // //                         </button>
// // //                       </div>
// // //                     )}

// // //                     {/* Submit Button */}
// // //                     <button
// // //                       type="submit"
// // //                       disabled={
// // //                         submitting || 
// // //                         checkingEmail || 
// // //                         checkingPhone ||
// // //                         emailExists || 
// // //                         phoneExists ||
// // //                         !!emailError || 
// // //                         !!phoneError ||
// // //                         !!domainSuggestion
// // //                       }
// // //                       className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-lg shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all ai-shimmer relative overflow-hidden"
// // //                     >
// // //                       {submitting ? (
// // //                         <span className="flex items-center justify-center gap-3">
// // //                           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // //                           Submitting...
// // //                         </span>
// // //                       ) : checkingEmail || checkingPhone ? (
// // //                         'Verifying...'
// // //                       ) : (
// // //                         'Start My Partnership'
// // //                       )}
// // //                     </button>
// // //                   </form>

// // //                   {/* Benefits */}
// // //                   <div className="mt-12 pt-8 border-t border-outline-variant/30">
// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                       {['Free onboarding', 'Secure business info', 'Setup assistance', 'No tech expertise'].map((benefit) => (
// // //                         <div key={benefit} className="flex items-center gap-2 text-on-surface-variant">
// // //                           <MaterialIcon name="check_circle" filled className="text-primary" />
// // //                           <span className="text-sm font-bold uppercase">{benefit}</span>
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* RIGHT: FEATURES */}
// // //               <div className="lg:col-span-5 space-y-8">
// // //                 <h3 className="text-2xl font-bold text-on-surface">Why Join Tilesview360?</h3>
// // //                 <div className="grid grid-cols-1 gap-4">
// // //                   {[
// // //                     { icon: 'trending_up', color: 'primary', title: 'Increase Sales', desc: 'Customers preview tiles before purchasing, reducing decision fatigue.' },
// // //                     { icon: 'architecture', color: 'secondary', title: 'Realistic 3D Visualization', desc: 'Real-time rendering of Kitchen, Bathroom, and Living Room scenes.' },
// // //                     { icon: 'menu_book', color: 'tertiary', title: 'Digital Tile Catalog', desc: 'Scan QR codes to visualize tiles instantly on any device.' },
// // //                     { icon: 'analytics', color: 'primary', title: 'Business Insights', desc: 'Track customer preferences with AI-driven analytics dashboards.' },
// // //                     { icon: 'cloud_done', color: 'secondary', title: 'Cloud Backup', desc: 'Access inventory across all showroom tablets and devices.' },
// // //                     { icon: 'support_agent', color: 'tertiary', title: 'Dedicated Support', desc: 'Technical training and onboarding for your sales team.' }
// // //                   ].map((feature, idx) => (
// // //                     <div key={idx} className="group flex gap-4 p-4 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// // //                       <div className={`flex-shrink-0 w-12 h-12 bg-${feature.color}-container/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
// // //                         <MaterialIcon name={feature.icon} className={`text-${feature.color} text-2xl`} />
// // //                       </div>
// // //                       <div>
// // //                         <h4 className="font-bold text-on-surface mb-1">{feature.title}</h4>
// // //                         <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* CTA Section */}
// // //         <section className="py-24 relative overflow-hidden bg-surface-dim">
// // //           <div className="absolute inset-0 z-0">
// // //             <div 
// // //               className="w-full h-full bg-cover bg-center backdrop-blur-xl opacity-40"
// // //               style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUmLy8G6Mkpr2MHBnmreJXZpIMZ6-ybcvNsoccP5n0X_tgXcFXnC4Y4Bp1QU4Mpg5uONRga0Lmz1r_KOf2vFV_wXv5rBa2zYecsgNZQbTGun8yn06lGUTbQdpkZ5zDNGFsyxNqTqmxOlMD-I9S4AqMJyHdoknU6KmqaWRRipqSEL0UfQNEVe6R9nctBZQaYjO7swESY2NX5MkXgBeEFUD2g8GfETA5KeYL--6GrCDW5GEz0GGVWJ0Wwgp366-h0CQmHRKTrGD4Lfs')" }}
// // //             />
// // //             <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent"></div>
// // //           </div>
// // //           <div className="container mx-auto px-6 md:px-16 relative z-10 text-center text-white">
// // //             <h2 className="text-4xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
// // //               Join hundreds of forward-thinking tile businesses using AI-powered 3D visualization
// // //             </h2>
// // //           </div>
// // //         </section>
// // //       </main>

// // //       {/* Footer */}
// // //       <footer className="bg-surface-container-low border-t border-outline-variant/30">
// // //         <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-8">
// // //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
// // //             <div className="space-y-4">
// // //               <div className="flex items-center gap-3">
// // //                 <img alt="Logo" className="h-8 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida/AP1WRLvyx1wURSmrzX5ul0t2vQ8aBshaKymLVrexE8a4wVcx7hE9IjLaMZUqPTDdznaHSBwK3XvURG2nIW_zkma-oYS7AFEV_KYVZkBQP3P-cMYs1tv0s-NQw1jqjIpkRV0Zpvm6Fl61U61IBgbrmJICuaM1CBBfVuRq2VDVgK4WkFLCzLbOp80V9UwxJR66L5b_C9ZUelWeuQX9OayYAEjrcKahWVuG3N5HETtk-_q-GjJ71l_PmCcid1dYCYS8" />
// // //                 <span className="font-semibold text-on-surface">VirtuThings AI</span>
// // //               </div>
// // //               <p className="text-on-surface-variant text-sm max-w-xs">
// // //                 Empowering architecture and real estate with hyper-realistic AI visualizations.
// // //               </p>
// // //             </div>
// // //             <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-x-12 gap-y-6">
// // //               {['Privacy Policy', 'Terms of Service', 'Partner Agreement', 'Contact'].map((link) => (
// // //                 <a key={link} className="text-sm uppercase text-on-surface-variant hover:text-secondary transition-colors" href="#">
// // //                   {link}
// // //                 </a>
// // //               ))}
// // //             </div>
// // //           </div>
// // //           <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
// // //             <p className="text-sm text-on-surface-variant">© 2024 VirtuThings AI. All rights reserved.</p>
// // //             <div className="flex gap-6">
// // //               <MaterialIcon name="public" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// // //               <MaterialIcon name="mail" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// // //               <MaterialIcon name="share" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </footer>

// // //       <style>{`
// // //         .glass-card {
// // //           background: rgba(255, 255, 255, 0.4);
// // //           backdrop-filter: blur(20px);
// // //           -webkit-backdrop-filter: blur(20px);
// // //           border: 1px solid rgba(255, 255, 255, 0.6);
// // //         }
// // //         .ai-shimmer {
// // //           position: relative;
// // //           overflow: hidden;
// // //         }
// // //         .ai-shimmer::after {
// // //           content: "";
// // //           position: absolute;
// // //           top: -50%;
// // //           left: -50%;
// // //           width: 200%;
// // //           height: 200%;
// // //           background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%);
// // //           animation: shimmer 4s infinite linear;
// // //         }
// // //         @keyframes shimmer {
// // //           0% { transform: translate(-30%, -30%); }
// // //           100% { transform: translate(30%, 30%); }
// // //         }
// // //         .material-symbols-outlined {
// // //           font-family: 'Material Symbols Outlined';
// // //           font-weight: normal;
// // //           font-style: normal;
// // //           font-size: 24px;
// // //           line-height: 1;
// // //           letter-spacing: normal;
// // //           text-transform: none;
// // //           display: inline-block;
// // //           white-space: nowrap;
// // //           word-wrap: normal;
// // //           direction: ltr;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }; 

// // import React, { useState, useEffect, useRef, memo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// // import { db } from '../lib/firebase';
// // import { X,Menu } from 'lucide-react';
// // import Footer from './Footer';

// // interface FormData {
// //   businessName: string;
// //   businessType: string;
// //   ownerName: string;
// //   phone: string;
// //   businessAddress: string;
// //   city: string;
// //   state: string;
// //   pincode: string;
// //   email: string;
// //   numberOfBranches: string;
// //   additionalInfo: string;
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ MATERIAL ICONS COMPONENT
// // // ═══════════════════════════════════════════════════════════════════════════

// // const MaterialIcon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
// //   <span 
// //     className={`material-symbols-outlined ${className}`}
// //     style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
// //   >
// //     {name}
// //   </span>
// // );

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ MEMOIZED INPUT FIELD COMPONENT
// // // ═══════════════════════════════════════════════════════════════════════════

// // const InputField = memo(({ 
// //   label, 
// //   type = 'text',
// //   value, 
// //   onChange, 
// //   placeholder, 
// //   error, 
// //   checkMessage,
// //   checking,
// //   exists,
// //   required = false,
// //   maxLength,
// //   options,
// //   description
// // }: any) => {
// //   const isSelect = type === 'select';
  
// //   return (
// //     <div className="space-y-2">
// //       <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
// //         {label} {required && '*'}
// //       </label>
      
// //       {description && (
// //         <p className="text-xs text-red-600 font-medium">{description}</p>
// //       )}
      
// //       <div className="relative">
// //         {isSelect ? (
// //           <select
// //             value={value}
// //             onChange={onChange}
// //             className="w-full px-4 py-3 bg-surface rounded-xl border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all outline-none text-body-md appearance-none cursor-pointer"
// //             required={required}
// //           >
// //             {options?.map((opt: string) => (
// //               <option key={opt} value={opt}>{opt}</option>
// //             ))}
// //           </select>
// //         ) : (
// //           <input
// //             type={type}
// //             value={value}
// //             onChange={onChange}
// //             className={`
// //               w-full px-4 py-3 rounded-xl border-none ring-1 transition-all outline-none text-body-md
// //               ${error 
// //                 ? 'ring-2 ring-red-500 bg-red-50' 
// //                 : exists
// //                 ? 'ring-2 ring-red-500 bg-red-50'
// //                 : checking
// //                 ? 'ring-2 ring-blue-500 bg-blue-50 animate-pulse'
// //                 : checkMessage && !error
// //                 ? 'ring-2 ring-green-500 bg-green-50'
// //                 : 'ring-outline-variant focus:ring-2 focus:ring-primary bg-surface'
// //               }
// //             `}
// //             placeholder={placeholder}
// //             required={required}
// //             maxLength={maxLength}
// //           />
// //         )}
        
// //         {!isSelect && (checking || checkMessage) && (
// //           <div className="absolute right-3 top-1/2 -translate-y-1/2">
// //             {checking && (
// //               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
// //             )}
// //             {!checking && checkMessage && !exists && !error && (
// //               <MaterialIcon name="check_circle" filled className="text-green-600 text-2xl" />
// //             )}
// //             {!checking && exists && (
// //               <MaterialIcon name="cancel" filled className="text-red-600 text-2xl" />
// //             )}
// //           </div>
// //         )}
// //       </div>
      
// //       {error && (
// //         <p className="text-red-600 text-sm font-medium flex items-start gap-1.5">
// //           <MaterialIcon name="error" className="text-lg" />
// //           <span>{error}</span>
// //         </p>
// //       )}
      
// //       {checkMessage && !error && (
// //         <p className={`text-sm font-medium ${checking ? 'text-blue-700' : exists ? 'text-red-700' : 'text-green-700'}`}>
// //           {checkMessage}
// //         </p>
// //       )}
// //     </div>
// //   );
// // });

// // InputField.displayName = 'InputField';

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ MAIN SELLER REQUEST FORM COMPONENT
// // // ═══════════════════════════════════════════════════════════════════════════

// // export const SellerRequestForm: React.FC = () => {
// //   const navigate = useNavigate();
  
// //   const [formData, setFormData] = useState<FormData>(() => {
// //     const saved = localStorage.getItem('sellerRequestDraft');
// //     if (saved) {
// //       try {
// //         return JSON.parse(saved);
// //       } catch {
// //         return {
// //           businessName: '',
// //           businessType: 'Tile Showroom',
// //           ownerName: '',
// //           phone: '',
// //           businessAddress: '',
// //           city: '',
// //           state: '',
// //           pincode: '',
// //           email: '',
// //           numberOfBranches: '1',
// //           additionalInfo: ''
// //         };
// //       }
// //     }
// //     return {
// //       businessName: '',
// //       businessType: 'Tile Showroom',
// //       ownerName: '',
// //       phone: '',
// //       businessAddress: '',
// //       city: '',
// //       state: '',
// //       pincode: '',
// //       email: '',
// //       numberOfBranches: '1',
// //       additionalInfo: ''
// //     };
// //   });

// //   const [submitting, setSubmitting] = useState(false);
// //   const [submitted, setSubmitted] = useState(false);
// //   const [error, setError] = useState('');
// //     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [emailError, setEmailError] = useState('');
// //   const [phoneError, setPhoneError] = useState('');
// //   const [nameError, setNameError] = useState('');
// //   const [businessNameError, setBusinessNameError] = useState('');
// //   const [pincodeError, setPincodeError] = useState('');
// //   const [domainSuggestion, setDomainSuggestion] = useState('');

// //   const [checkingEmail, setCheckingEmail] = useState(false);
// //   const [emailExists, setEmailExists] = useState(false);
// //   const [emailCheckMessage, setEmailCheckMessage] = useState('');
  
// //   const [checkingPhone, setCheckingPhone] = useState(false);
// //   const [phoneExists, setPhoneExists] = useState(false);
// //   const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

// //   const [checkingBusinessName, setCheckingBusinessName] = useState(false);
// //   const [businessNameExists, setBusinessNameExists] = useState(false);
// //   const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState('');
  
// //   const lastCheckedEmail = useRef('');
// //   const lastCheckedPhone = useRef('');
// //   const lastCheckedBusinessName = useRef('');
// //   const checkInProgress = useRef(false);
// //   const lastSubmitTime = useRef(0);
// //   const SUBMIT_COOLDOWN = 5000;

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ VALIDATION FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   const validateEmail = (email: string): boolean => {
// //     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// //     if (!regex.test(email)) return false;
// //     const parts = email.split('@');
// //     if (parts.length !== 2) return false;
// //     if (parts[0].length === 0 || parts[1].length === 0) return false;
// //     if (!parts[1].includes('.')) return false;
// //     return true;
// //   };

// //   const validateEmailDomain = (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
// //     const commonTypos: Record<string, string> = {
// //       'gmali.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
// //       'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmial.com': 'gmail.com',
// //       'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahho.com': 'yahoo.com',
// //       'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
// //       'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com'
// //     };
    
// //     const parts = email.split('@');
// //     if (parts.length !== 2) return { isValid: false, hasTypo: false };
    
// //     const domain = parts[1]?.toLowerCase();
// //     if (!domain) return { isValid: false, hasTypo: false };
    
// //     if (commonTypos[domain]) {
// //       return { isValid: false, suggestion: parts[0] + '@' + commonTypos[domain], hasTypo: true };
// //     }
    
// //     return { isValid: true, hasTypo: false };
// //   };

// //   const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
// //     const cleaned = phone.replace(/\D/g, '');
// //     if (!cleaned) return { isValid: false, error: 'Phone number required' };
// //     if (cleaned.length !== 10) return { isValid: false, error: 'Must be exactly 10 digits' };
// //     if (!/^[6-9]/.test(cleaned)) return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
// //     return { isValid: true };
// //   };

// //   const validatePincode = (pincode: string): { isValid: boolean; error?: string } => {
// //     const cleaned = pincode.replace(/\D/g, '');
// //     if (!cleaned) return { isValid: false, error: 'Pincode required' };
// //     if (cleaned.length !== 6) return { isValid: false, error: 'Must be 6 digits' };
// //     return { isValid: true };
// //   };

// //   const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
// //     if (!name.trim()) return { isValid: false, error: 'Owner name required' };
// //     if (name.trim().length < 2) return { isValid: false, error: 'At least 2 characters required' };
// //     if (/\d/.test(name)) return { isValid: false, error: 'Cannot contain numbers' };
// //     if (!/^[a-zA-Z\s]+$/.test(name)) return { isValid: false, error: 'Only letters and spaces allowed' };
// //     return { isValid: true };
// //   };

// //   const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
// //     if (!name.trim()) return { isValid: false, error: 'Business name required' };
// //     if (name.trim().length < 3) return { isValid: false, error: 'At least 3 characters required' };
// //     if (name.trim().length > 100) return { isValid: false, error: 'Maximum 100 characters allowed' };
// //     return { isValid: true };
// //   };

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ DATABASE CHECK FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   const checkEmailExists = async (email: string): Promise<boolean> => {
// //     if (checkInProgress.current || !email || !validateEmail(email)) return false;

// //     const domainCheck = validateEmailDomain(email);
// //     if (domainCheck.hasTypo && domainCheck.suggestion) {
// //       setDomainSuggestion(domainCheck.suggestion);
// //       setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
// //       setEmailExists(false);
// //       setEmailCheckMessage('❌ Invalid domain');
// //       return false;
// //     } else {
// //       setDomainSuggestion('');
// //     }

// //     checkInProgress.current = true;
// //     setCheckingEmail(true);
// //     setEmailCheckMessage('🔍 Checking...');

// //     try {
// //       const emailToCheck = email.toLowerCase().trim();

// //       const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
// //       const sellersSnapshot = await getDocs(sellersQuery);
      
// //       if (sellersSnapshot.size > 0) {
// //         setEmailExists(true);
// //         setEmailCheckMessage('❌ Already registered');
// //         setEmailError('Email already registered');
// //         setCheckingEmail(false);
// //         checkInProgress.current = false;
// //         lastCheckedEmail.current = emailToCheck;
// //         return true;
// //       }

// //       const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
// //       const requestsSnapshot = await getDocs(requestsQuery);
      
// //       if (requestsSnapshot.size > 0) {
// //         const status = requestsSnapshot.docs[0].data().status;
// //         if (status === 'pending') {
// //           setEmailExists(true);
// //           setEmailCheckMessage('⏳ Request pending');
// //           setEmailError('Request already pending');
// //         } else if (status === 'approved') {
// //           setEmailExists(true);
// //           setEmailCheckMessage('✅ Already approved');
// //           setEmailError('Account already exists');
// //         } else {
// //           setEmailExists(false);
// //           setEmailCheckMessage('⚠️ Can reapply');
// //           setEmailError('');
// //         }
// //         setCheckingEmail(false);
// //         checkInProgress.current = false;
// //         lastCheckedEmail.current = emailToCheck;
// //         return status === 'pending' || status === 'approved';
// //       }

// //       setEmailExists(false);
// //       setEmailCheckMessage('✅ Available');
// //       setEmailError('');
// //       setCheckingEmail(false);
// //       checkInProgress.current = false;
// //       lastCheckedEmail.current = emailToCheck;
// //       return false;

// //     } catch (error) {
// //       console.error('Email check error:', error);
// //       setEmailCheckMessage('⚠️ Check failed');
// //       setEmailExists(false);
// //       setCheckingEmail(false);
// //       checkInProgress.current = false;
// //       return false;
// //     }
// //   };

// //   const checkPhoneExists = async (phone: string): Promise<boolean> => {
// //     const cleaned = phone.replace(/\D/g, '');
// //     if (!cleaned || cleaned.length !== 10) return false;
// //     if (lastCheckedPhone.current === cleaned) return phoneExists;

// //     setCheckingPhone(true);
// //     setPhoneCheckMessage('🔍 Checking...');

// //     try {
// //       const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
// //       const sellersSnapshot = await getDocs(sellersQuery);
      
// //       if (sellersSnapshot.size > 0) {
// //         setPhoneExists(true);
// //         setPhoneCheckMessage('❌ Already registered');
// //         setPhoneError('Phone already in use');
// //         setCheckingPhone(false);
// //         lastCheckedPhone.current = cleaned;
// //         return true;
// //       }

// //       const requestsQuery = query(collection(db, 'sellerRequests'), where('phone', '==', cleaned));
// //       const requestsSnapshot = await getDocs(requestsQuery);
      
// //       if (requestsSnapshot.size > 0) {
// //         const status = requestsSnapshot.docs[0].data().status;
// //         if (status === 'pending' || status === 'approved') {
// //           setPhoneExists(true);
// //           setPhoneCheckMessage('❌ Phone in use');
// //           setPhoneError('Phone already registered');
// //           setCheckingPhone(false);
// //           lastCheckedPhone.current = cleaned;
// //           return true;
// //         }
// //       }

// //       setPhoneExists(false);
// //       setPhoneCheckMessage('✅ Available');
// //       setPhoneError('');
// //       setCheckingPhone(false);
// //       lastCheckedPhone.current = cleaned;
// //       return false;

// //     } catch (error) {
// //       console.error('Phone check error:', error);
// //       setPhoneCheckMessage('');
// //       setPhoneExists(false);
// //       setCheckingPhone(false);
// //       return false;
// //     }
// //   };

// //   const checkBusinessNameExists = async (name: string): Promise<boolean> => {
// //     const normalized = name.toLowerCase().trim();
// //     if (!normalized || normalized.length < 3) return false;
// //     if (lastCheckedBusinessName.current === normalized) return businessNameExists;

// //     setCheckingBusinessName(true);
// //     setBusinessNameCheckMessage('🔍 Checking...');

// //     try {
// //       const sellersQuery = query(collection(db, 'sellers'), where('businessName', '==', normalized));
// //       const sellersSnapshot = await getDocs(sellersQuery);
      
// //       if (sellersSnapshot.size > 0) {
// //         setBusinessNameExists(true);
// //         setBusinessNameCheckMessage('⚠️ Similar name exists');
// //         setBusinessNameError('Consider using a unique name');
// //         setCheckingBusinessName(false);
// //         lastCheckedBusinessName.current = normalized;
// //         return true;
// //       }

// //       setBusinessNameExists(false);
// //       setBusinessNameCheckMessage('✅ Unique');
// //       setBusinessNameError('');
// //       setCheckingBusinessName(false);
// //       lastCheckedBusinessName.current = normalized;
// //       return false;

// //     } catch (error) {
// //       console.error('Business name check error:', error);
// //       setBusinessNameCheckMessage('');
// //       setBusinessNameExists(false);
// //       setCheckingBusinessName(false);
// //       return false;
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ DEBOUNCED CHECKS
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   useEffect(() => {
// //     if (!formData.email) {
// //       setEmailExists(false);
// //       setEmailCheckMessage('');
// //       setEmailError('');
// //       setDomainSuggestion('');
// //       return;
// //     }

// //     if (!validateEmail(formData.email)) {
// //       setEmailExists(false);
// //       setEmailCheckMessage('');
// //       if (!formData.email.includes('@')) setEmailError('Email must contain @');
// //       return;
// //     }

// //     if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) return;

// //     const timer = setTimeout(() => {
// //       checkEmailExists(formData.email);
// //     }, 800);

// //     return () => clearTimeout(timer);
// //   }, [formData.email]);

// //   useEffect(() => {
// //     const cleaned = formData.phone.replace(/\D/g, '');
// //     if (!cleaned || cleaned.length !== 10) {
// //       setPhoneExists(false);
// //       setPhoneCheckMessage('');
// //       return;
// //     }

// //     if (lastCheckedPhone.current === cleaned) return;

// //     const timer = setTimeout(() => {
// //       checkPhoneExists(formData.phone);
// //     }, 1000);

// //     return () => clearTimeout(timer);
// //   }, [formData.phone]);

// //   useEffect(() => {
// //     const normalized = formData.businessName.toLowerCase().trim();
// //     if (!normalized || normalized.length < 3) {
// //       setBusinessNameExists(false);
// //       setBusinessNameCheckMessage('');
// //       return;
// //     }

// //     if (lastCheckedBusinessName.current === normalized) return;

// //     const timer = setTimeout(() => {
// //       checkBusinessNameExists(formData.businessName);
// //     }, 1000);

// //     return () => clearTimeout(timer);
// //   }, [formData.businessName]);

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ LOCAL STORAGE SAVE
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   useEffect(() => {
// //     if (!submitted) {
// //       const timer = setTimeout(() => {
// //         localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
// //       }, 500);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [formData, submitted]);

// //   useEffect(() => {
// //     if (submitted) {
// //       localStorage.removeItem('sellerRequestDraft');
// //     }
// //   }, [submitted]);

// //   useEffect(() => {
// //     if (mobileMenuOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = 'unset';
// //     }
// //     return () => { document.body.style.overflow = 'unset'; };
// //   }, [mobileMenuOpen]);

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ INPUT CHANGE HANDLER
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   const handleInputChange = (field: keyof FormData, value: string) => {
// //     setFormData(prev => ({ ...prev, [field]: value }));
    
// //     if (error) setError('');
    
// //     if (field === 'email') {
// //       setEmailCheckMessage('');
// //       setEmailExists(false);
// //       setDomainSuggestion('');
// //       lastCheckedEmail.current = '';
// //       if (emailError) setEmailError('');
// //     }
    
// //     if (field === 'phone') {
// //       setPhoneCheckMessage('');
// //       setPhoneExists(false);
// //       lastCheckedPhone.current = '';
// //       if (phoneError) setPhoneError('');
// //       if (value) {
// //         const validation = validatePhone(value);
// //         if (!validation.isValid) setPhoneError(validation.error || 'Invalid');
// //       }
// //     }
    
// //     if (field === 'businessName') {
// //       setBusinessNameCheckMessage('');
// //       setBusinessNameExists(false);
// //       lastCheckedBusinessName.current = '';
// //       if (businessNameError) setBusinessNameError('');
// //       if (value) {
// //         const validation = validateBusinessName(value);
// //         if (!validation.isValid) setBusinessNameError(validation.error || 'Invalid');
// //       }
// //     }
    
// //     if (field === 'ownerName') {
// //       if (nameError) setNameError('');
// //       if (value) {
// //         const validation = validateOwnerName(value);
// //         if (!validation.isValid) setNameError(validation.error || 'Invalid');
// //       }
// //     }

// //     if (field === 'pincode') {
// //       if (pincodeError) setPincodeError('');
// //       if (value) {
// //         const validation = validatePincode(value);
// //         if (!validation.isValid) setPincodeError(validation.error || 'Invalid');
// //       }
// //     }
// //   };

// //   const useSuggestedEmail = () => {
// //     if (domainSuggestion) {
// //       setFormData(prev => ({ ...prev, email: domainSuggestion }));
// //       setDomainSuggestion('');
// //       setEmailError('');
// //       setEmailCheckMessage('');
// //       lastCheckedEmail.current = '';
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ FORM VALIDATION
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   const validateForm = (): boolean => {
// //     const businessValidation = validateBusinessName(formData.businessName);
// //     if (!businessValidation.isValid) {
// //       setBusinessNameError(businessValidation.error || 'Invalid');
// //       setError('Please fix business name');
// //       return false;
// //     }
    
// //     const nameValidation = validateOwnerName(formData.ownerName);
// //     if (!nameValidation.isValid) {
// //       setNameError(nameValidation.error || 'Invalid');
// //       setError('Please fix owner name');
// //       return false;
// //     }
    
// //     if (!formData.email || !validateEmail(formData.email)) {
// //       setEmailError('Enter a valid email address');
// //       setError('Email is required and must be valid');
// //       return false;
// //     }

// //     const domainCheck = validateEmailDomain(formData.email);
// //     if (domainCheck.hasTypo) {
// //       setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
// //       setError(`Email typo detected!`);
// //       setDomainSuggestion(domainCheck.suggestion || '');
// //       return false;
// //     }

// //     const phoneValidation = validatePhone(formData.phone);
// //     if (!phoneValidation.isValid) {
// //       setPhoneError(phoneValidation.error || 'Invalid');
// //       setError('Please fix phone number');
// //       return false;
// //     }

// //     const pincodeValidation = validatePincode(formData.pincode);
// //     if (!pincodeValidation.isValid) {
// //       setPincodeError(pincodeValidation.error || 'Invalid');
// //       setError('Please fix pincode');
// //       return false;
// //     }
    
// //     if (!formData.businessAddress.trim()) {
// //       setError('Business address required');
// //       return false;
// //     }

// //     if (!formData.city.trim()) {
// //       setError('City required');
// //       return false;
// //     }

// //     if (!formData.state.trim()) {
// //       setError('State required');
// //       return false;
// //     }
    
// //     return true;
// //   };

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ FORM SUBMIT
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const now = Date.now();
// //     if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
// //       const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
// //       alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
// //       return;
// //     }

// //     if (checkingEmail || checkingPhone || checkInProgress.current) {
// //       alert('⏳ Please wait! Email/Phone verification in progress.');
// //       return;
// //     }

// //     if (domainSuggestion) {
// //       alert(`❌ Invalid Email Domain!\n\nPlease use: ${domainSuggestion}`);
// //       return;
// //     }

// //     if (!validateForm()) return;

// //     setSubmitting(true);
// //     setError('Final verification...');

// //     try {
// //       const emailIsRegistered = await checkEmailExists(formData.email);
// //       if (emailIsRegistered) {
// //         setError('❌ Email already registered');
// //         alert('❌ Email Already Registered!');
// //         setSubmitting(false);
// //         return;
// //       }

// //       const phoneIsRegistered = await checkPhoneExists(formData.phone);
// //       if (phoneIsRegistered) {
// //         setError('❌ Phone already registered');
// //         alert('❌ Phone Already Registered!');
// //         setSubmitting(false);
// //         return;
// //       }

// //       setError('');
// //     } catch (err) {
// //       console.error('Verification error:', err);
// //       setError('Verification failed. Try again.');
// //       setSubmitting(false);
// //       return;
// //     }

// //     if (emailExists || phoneExists) {
// //       alert('❌ Cannot Submit! Duplicate data found.');
// //       setSubmitting(false);
// //       return;
// //     }

// //     try {
// //       await addDoc(collection(db, 'sellerRequests'), {
// //         businessName: formData.businessName.trim(),
// //         businessType: formData.businessType,
// //         ownerName: formData.ownerName.trim(),
// //         email: formData.email.toLowerCase().trim(),
// //         phone: formData.phone.replace(/\D/g, ''),
// //         businessAddress: formData.businessAddress.trim(),
// //         city: formData.city.trim(),
// //         state: formData.state.trim(),
// //         pincode: formData.pincode.replace(/\D/g, ''),
// //         numberOfBranches: formData.numberOfBranches,
// //         additionalInfo: formData.additionalInfo.trim() || null,
// //         status: 'pending',
// //         requestedAt: new Date().toISOString(),
// //         adminNotes: null,
// //         reviewedAt: null,
// //         reviewedBy: null,
// //         emailDeliveryStatus: null,
// //         accountCreated: false
// //       });

// //       lastSubmitTime.current = Date.now();
// //       setSubmitted(true);
      
// //     } catch (err: any) {
// //       console.error('Firestore error:', err);
// //       if (err.code === 'permission-denied') {
// //         setError('❌ Permission denied. Contact support.');
// //       } else {
// //         setError('❌ Submission failed. Try again.');
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ SUCCESS SCREEN
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   if (submitted) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border-2 border-green-400">
// //           <div className="mb-6">
// //             <MaterialIcon name="check_circle" filled className="text-green-600 text-8xl mx-auto animate-bounce" />
// //           </div>
          
// //           <h3 className="text-4xl font-bold text-green-800 mb-4">
// //             ✅ Request Submitted Successfully!
// //           </h3>
          
// //           <p className="text-xl text-green-700 mb-8">
// //             Thank you <strong>{formData.ownerName}</strong>!
// //           </p>
          
// //           <div className="bg-gray-50 rounded-2xl p-8 text-left border-2 border-gray-200">
// //             <h4 className="font-bold text-gray-900 mb-5 text-xl flex items-center gap-3">
// //               <MaterialIcon name="info" filled className="text-blue-600 text-3xl" />
// //               What's Next?
// //             </h4>
            
// //             <ul className="space-y-4 text-gray-700">
// //               <li className="flex items-start gap-3">
// //                 <MaterialIcon name="schedule" filled className="text-green-600 text-2xl flex-shrink-0" />
// //                 <span>Review in <strong>2-3 business days</strong></span>
// //               </li>
// //               <li className="flex items-start gap-3">
// //                 <MaterialIcon name="mail" filled className="text-green-600 text-2xl flex-shrink-0" />
// //                 <span className="break-all">Updates to: <strong>{formData.email}</strong></span>
// //               </li>
// //               <li className="flex items-start gap-3">
// //                 <MaterialIcon name="verified" filled className="text-green-600 text-2xl flex-shrink-0" />
// //                 <span>Login credentials if <strong>approved</strong></span>
// //               </li>
// //             </ul>
// //           </div>
          
// //           <div className="mt-8 bg-gray-100 rounded-xl p-5 inline-block">
// //             <p className="text-sm text-gray-600 mb-2">Reference ID</p>
// //             <p className="text-2xl font-mono font-bold text-gray-900">
// //               REQ-{Date.now().toString().slice(-8)}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ MAIN FORM UI
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   return (
// //     <div className="min-h-screen bg-background">
      
// //       {/* ✅ NAVIGATION BAR - MATCHING APP.TSX WIDTH STRUCTURE */}
// //    {/* ✅ NAVIGATION BAR - EXACT APP.TSX STYLE + CLOSE BUTTON */}
// // <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
// //   <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-5 lg:py-6 flex items-center justify-between relative">
    
// //     {/* Logo */}
// //     <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
// //       <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// //         <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// //         <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// //       </div>
// //       <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
// //         Tilesview360
// //       </span>
// //     </div>

// //     {/* Desktop Navigation Links */}
// //     <div className="hidden lg:flex items-center gap-10 xl:gap-12">
// //       <button 
// //         onClick={() => navigate('/')}
// //         className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //       >
// //         Product
// //       </button>
// //       <button 
// //         onClick={() => navigate('/')}
// //         className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //       >
// //         Features
// //       </button>
// //       <button 
// //         onClick={() => navigate('/')}
// //         className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //       >
// //         Pricing
// //       </button>
// //       <span className="text-gray-900 text-[16px] xl:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF]">
// //         Partners
// //       </span>
// //     </div>

// //     {/* Desktop Right Actions */}
// //     <div className="hidden lg:flex items-center gap-6 xl:gap-8">
// //       <button 
// //         onClick={() => navigate('/')}
// //         className="text-gray-700 text-[16px] xl:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// //       >
// //         Back to Home
// //       </button>
// //       <button 
// //         onClick={() => navigate('/')}
// //         className="bg-[#0040DF] text-white text-[16px] xl:text-[18px] px-6 xl:px-7 py-3 xl:py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2"
// //       >
// //         <X className="w-4 h-4" />
// //         Close
// //       </button>
// //     </div>

// //     {/* Mobile Menu Button */}
// //     <button
// //       onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //       className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// //       aria-label="Toggle menu"
// //     >
// //       {mobileMenuOpen ? (
// //         <X className="w-6 h-6 stroke-[2.5px]" />
// //       ) : (
// //         <Menu className="w-6 h-6 stroke-[2.5px]" />
// //       )}
// //     </button>

// //     {/* Mobile Menu Overlay */}
// //     {mobileMenuOpen && (
// //       <>
// //         <div 
// //           className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// //           style={{ animationDuration: '0.3s' }}
// //           onClick={() => setMobileMenuOpen(false)}
// //         />
// //         <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// //           <div className="max-w-md mx-auto space-y-6">
// //             <div className="space-y-2">
           
         
// //     </div>
            
// //             <div className="pt-4 border-t border-gray-100 space-y-3">
// //               <button
// //                 onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
// //                 className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// //               >
// //                 Back to Home
// //               </button>
           
// //             </div>
// //           </div>
// //         </div>
// //       </>
// //     )}
// //   </div>
// // </nav>

// //       <main className="pt-20">
        
// //         {/* ✅ HERO SECTION - MATCHING WIDTH */}
// //   {/* ✅ HERO SECTION - ENHANCED HEIGHT */}
// // <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden">
// //   <div className="absolute inset-0 z-0">
// //     <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10"></div>
// //     <div 
// //       className="w-full h-full bg-cover bg-center opacity-30" 
// //       style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAroFBavzMYbVtTnj6guHgLgiyRbS4brV2u8LcZRQIewhnEoEWX-C1xnGPMUyOGA_zhWpDcCV_c4lZtco2thvCgItp-fZZOncdfueG4x-CyWT6kd0vIAU6sUE5-hLla2x2-te7Ohikf83acy5pr4_sQRWLe-4_Acr5geqgmLQTrKNEqahOlu4vVSxq-6flte9fsSJ0xBvmnduC6LSX1L8trOUIFTYv46Oyx080w0vIn9uu-7WBvva6OQMA0RI-Ez8-Qv7ebcagl4WKg')" }}
// //     />
// //   </div>
  
// //   <div className="container mx-auto px-3 md:px-5 max-w-[1800px] relative z-20 py-16 md:py-20 lg:py-24">
// //     <div className="max-w-4xl">
// //       <h1 className="text-[44px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface mb-8 lg:mb-10">
// //         Transform Your Tile Showroom Into a <span className="text-primary">Smart Experience</span>
// //       </h1>
      
// //       <p className="text-[17px] md:text-[19px] lg:text-[21px] text-on-surface-variant mb-12 lg:mb-16 leading-relaxed max-w-2xl">
// //         Help customers visualize every tile before they buy, increase confidence, and close more sales with AI-powered 3D visualization.
// //       </p>
      
// //       <div className="flex flex-wrap gap-4 md:gap-6">
// //         <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
// //           <MaterialIcon name="store" filled className="text-primary text-2xl" />
// //           <span className="text-[14px] md:text-[15px] font-bold uppercase">Trusted by Dealers</span>
// //         </div>
// //         <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
// //           <MaterialIcon name="view_in_ar" filled className="text-secondary text-2xl" />
// //           <span className="text-[14px] md:text-[15px] font-bold uppercase">Realistic 3D Preview</span>
// //         </div>
// //         <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
// //           <MaterialIcon name="qr_code_2" filled className="text-primary text-2xl" />
// //           <span className="text-[14px] md:text-[15px] font-bold uppercase">QR Powered Catalog</span>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </section>

// //       {/* ✅ FORM & FEATURES SECTION - ENHANCED SIZES */}
// // <section className="py-24 bg-surface-container-lowest">
// //   <div className="container mx-auto px-3 md:px-5 max-w-[1800px]">
// //   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 xl:gap-32 items-start">
      
// //       {/* LEFT: FORM */}
// //       <div className="lg:col-span-7">
// //         <div className="glass-card p-10 md:p-14 rounded-3xl shadow-xl">
// //           <div className="mb-12 p-6 bg-primary/10 border-l-4 border-primary rounded-lg">
// //             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
// //               Become a <span className="text-primary">Tilesview360 Partner</span>
// //             </h2>
// //           </div>

// //           {error && (
// //             <div className="mb-8 p-5 bg-red-50 border-2 border-red-400 rounded-xl flex items-start gap-4">
// //               <MaterialIcon name="error" className="text-red-600 text-3xl flex-shrink-0" />
// //               <span className="text-red-900 font-semibold text-lg">{error}</span>
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-8">
// //             {/* Business Name & Type */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <InputField
// //                 label="Business Name"
// //                 value={formData.businessName}
// //                 onChange={(e: any) => handleInputChange('businessName', e.target.value)}
// //                 placeholder="Enter your business name"
// //                 error={businessNameError}
// //                 checkMessage={businessNameCheckMessage}
// //                 checking={checkingBusinessName}
// //                 exists={businessNameExists}
// //                 required
// //               />
// //               <InputField
// //                 label="Business Type"
// //                 type="select"
// //                 value={formData.businessType}
// //                 onChange={(e: any) => handleInputChange('businessType', e.target.value)}
// //                 options={['Tile Showroom', 'Tile Distributor', 'Tile Manufacturer', 'Builder', 'Interior Studio']}
// //               />
// //             </div>

// //             {/* Owner Name & Contact */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <InputField
// //                 label="Owner Name"
// //                 value={formData.ownerName}
// //                 onChange={(e: any) => handleInputChange('ownerName', e.target.value)}
// //                 placeholder="Full name of owner"
// //                 error={nameError}
// //                 required
// //               />
// //               <InputField
// //                 label="Contact Number"
// //                 type="tel"
// //                 value={formData.phone}
// //                 onChange={(e: any) => handleInputChange('phone', e.target.value)}
// //                 placeholder="9876543210"
// //                 error={phoneError}
// //                 checkMessage={phoneCheckMessage}
// //                 checking={checkingPhone}
// //                 exists={phoneExists}
// //                 maxLength={10}
// //                 required
// //               />
// //             </div>

// //             {/* Business Address */}
// //             <InputField
// //               label="Business Address"
// //               value={formData.businessAddress}
// //               onChange={(e: any) => handleInputChange('businessAddress', e.target.value)}
// //               placeholder="Showroom street address"
// //               required
// //             />

// //             {/* City, State, Pincode */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //               <InputField
// //                 label="City"
// //                 value={formData.city}
// //                 onChange={(e: any) => handleInputChange('city', e.target.value)}
// //                 placeholder="City"
// //                 required
// //               />
// //               <InputField
// //                 label="State"
// //                 value={formData.state}
// //                 onChange={(e: any) => handleInputChange('state', e.target.value)}
// //                 placeholder="State"
// //                 required
// //               />
// //               <InputField
// //                 label="Pincode"
// //                 value={formData.pincode}
// //                 onChange={(e: any) => handleInputChange('pincode', e.target.value)}
// //                 placeholder="123456"
// //                 error={pincodeError}
// //                 maxLength={6}
// //                 required
// //               />
// //             </div>

// //             {/* Email & Branches */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <InputField
// //                 label="Business Email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={(e: any) => handleInputChange('email', e.target.value)}
// //                 placeholder="contact@business.com"
// //                 error={emailError}
// //                 checkMessage={emailCheckMessage}
// //                 checking={checkingEmail}
// //                 exists={emailExists}
// //                 required
// //                 description="Must be valid (e.g., name@gmail.com)"
// //               />
// //               <InputField
// //                 label="Number of Branches"
// //                 type="select"
// //                 value={formData.numberOfBranches}
// //                 onChange={(e: any) => handleInputChange('numberOfBranches', e.target.value)}
// //                 options={['1', '2–5', '5+']}
// //               />
// //             </div>

// //             {/* Domain Suggestion */}
// //             {domainSuggestion && (
// //               <div className="p-6 rounded-xl bg-red-50 border-2 border-red-400">
// //                 <p className="text-red-900 font-bold mb-3 text-xl">❌ Invalid Email Domain!</p>
// //                 <p className="text-red-800 text-base mb-4">
// //                   You typed: <strong className="text-lg">{formData.email}</strong><br />
// //                   Did you mean: <strong className="text-green-700 text-lg">{domainSuggestion}</strong>?
// //                 </p>
// //                 <button
// //                   type="button"
// //                   onClick={useSuggestedEmail}
// //                   className="w-full bg-green-600 text-white px-5 py-4 rounded-lg hover:bg-green-700 font-bold text-lg"
// //                 >
// //                   ✅ Use {domainSuggestion}
// //                 </button>
// //               </div>
// //             )}

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={
// //                 submitting || 
// //                 checkingEmail || 
// //                 checkingPhone ||
// //                 emailExists || 
// //                 phoneExists ||
// //                 !!emailError || 
// //                 !!phoneError ||
// //                 !!domainSuggestion
// //               }
// //               className="w-full py-5 bg-primary text-white font-bold rounded-2xl text-xl shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all ai-shimmer relative overflow-hidden"
// //             >
// //               {submitting ? (
// //                 <span className="flex items-center justify-center gap-3">
// //                   <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                   Submitting...
// //                 </span>
// //               ) : checkingEmail || checkingPhone ? (
// //                 'Verifying...'
// //               ) : (
// //                 'Start My Partnership'
// //               )}
// //             </button>
// //           </form>

// //           {/* Benefits */}
// //           <div className="mt-14 pt-10 border-t border-outline-variant/30">
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //               {['Free onboarding', 'Secure business info', 'Setup assistance', 'No tech expertise'].map((benefit) => (
// //                 <div key={benefit} className="flex items-center gap-3 text-on-surface-variant">
// //                   <MaterialIcon name="check_circle" filled className="text-primary text-3xl" />
// //                   <span className="text-base font-bold uppercase">{benefit}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* RIGHT: FEATURES */}
// //       {/* <div className="lg:col-span-5 space-y-10">
// //         <h3 className="text-3xl md:text-4xl font-bold text-on-surface">Why Join Tilesview360?</h3>
// //         <div className="grid grid-cols-1 gap-6">
// //           {[
// //             { icon: 'trending_up', color: 'primary', title: 'Increase Sales', desc: 'Customers preview tiles before purchasing, reducing decision fatigue.' },
// //             { icon: 'architecture', color: 'secondary', title: 'Realistic 3D Visualization', desc: 'Real-time rendering of Kitchen, Bathroom, and Living Room scenes.' },
// //             { icon: 'menu_book', color: 'tertiary', title: 'Digital Tile Catalog', desc: 'Scan QR codes to visualize tiles instantly on any device.' },
// //             { icon: 'analytics', color: 'primary', title: 'Business Insights', desc: 'Track customer preferences with AI-driven analytics dashboards.' },
// //             { icon: 'cloud_done', color: 'secondary', title: 'Cloud Backup', desc: 'Access inventory across all showroom tablets and devices.' },
// //             { icon: 'support_agent', color: 'tertiary', title: 'Dedicated Support', desc: 'Technical training and onboarding for your sales team.' }
// //           ].map((feature, idx) => (
// //             <div key={idx} className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //               <div className={`flex-shrink-0 w-16 h-16 bg-${feature.color}-container/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
// //                 <MaterialIcon name={feature.icon} className={`text-${feature.color} text-3xl`} />
// //               </div>
// //               <div>
// //                 <h4 className="font-bold text-on-surface mb-2 text-xl">{feature.title}</h4>
// //                 <p className="text-base text-on-surface-variant leading-relaxed">{feature.desc}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div> */} 
// //       {/* RIGHT: FEATURES */}
// // <div className="lg:col-span-5 space-y-10">
// //   <h3 className="text-3xl md:text-4xl font-bold text-on-surface">Why Join Tilesview360?</h3>
  
// //   <div className="grid grid-cols-1 gap-6">
// //     {/* Feature 1 - Increase Sales */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="trending_up" className="text-primary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Increase Sales</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Customers can preview tiles in high-fidelity environments before purchasing, reducing decision fatigue.
// //         </p>
// //       </div>
// //     </div>

// //     {/* Feature 2 - Realistic 3D Visualization */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="architecture" className="text-secondary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Realistic 3D Visualization</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Real-time rendering of Kitchen, Bathroom, and Living Room scenes with your exact inventory.
// //         </p>
// //       </div>
// //     </div>

// //     {/* Feature 3 - Digital Tile Catalog */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="menu_book" className="text-tertiary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Digital Tile Catalog</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Let workers scan any tile QR in your showroom to visualize it instantly on the device.
// //         </p>
// //       </div>
// //     </div>

// //     {/* Feature 4 - Business Insights */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="analytics" className="text-primary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Business Insights</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Track customer preferences and showroom activity with comprehensive AI-driven analytics dashboards.
// //         </p>
// //       </div>
// //     </div>

// //     {/* Feature 5 - Cloud Backup */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="cloud_done" className="text-secondary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Cloud Backup</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Securely access your inventory and customer designs across all showroom tablets and devices.
// //         </p>
// //       </div>
// //     </div>

// //     {/* Feature 6 - Dedicated Support */}
// //     <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
// //       <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
// //         <MaterialIcon name="support_agent" className="text-tertiary text-3xl" />
// //       </div>
// //       <div>
// //         <h4 className="font-bold text-on-surface mb-2 text-xl">Dedicated Support</h4>
// //         <p className="text-base text-on-surface-variant leading-relaxed">
// //           Direct access to technical training and onboarding for your sales team to maximize ROI.
// //         </p>
// //       </div>
// //     </div>
// //   </div>
// // </div>
// //     </div>
// //   </div>
// // </section>

// //         {/* ✅ CTA SECTION - MATCHING WIDTH */}
// //       {/* <section className="py-16 md:py-20 relative overflow-hidden bg-surface-dim">
// //   <div className="absolute inset-0 z-0">
// //     <div 
// //       className="w-full h-full bg-cover bg-center"
// //       style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUmLy8G6Mkpr2MHBnmreJXZpIMZ6-ybcvNsoccP5n0X_tgXcFXnC4Y4Bp1QU4Mpg5uONRga0Lmz1r_KOf2vFV_wXv5rBa2zYecsgNZQbTGun8yn06lGUTbQdpkZ5zDNGFsyxNqTqmxOlMD-I9S4AqMJyHdoknU6KmqaWRRipqSEL0UfQNEVe6R9nctBZQaYjO7swESY2NX5MkXgBeEFUD2g8GfETA5KeYL--6GrCDW5GEz0GGVWJ0Wwgp366-h0CQmHRKTrGD4Lfs')" }}
// //     />
// //     <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
// //     <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent"></div>
// //   </div>
  
// //   <div className="container mx-auto px-6 md:px-16 max-w-[1800px] relative z-10 text-center text-white">
// //     <h2 className="text-2xl md:text-4xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
// //       Join hundreds of forward-thinking tile businesses using AI-powered 3D visualization to help customers choose with confidence and increase showroom conversions.
// //     </h2>
// //   </div>
// // </section> */} 
// // <section className="py-32 md:py-44 relative overflow-hidden bg-surface-dim">
// //   <div className="absolute inset-0 z-0">
// //     <div 
// //       className="w-full h-full bg-cover bg-center backdrop-blur-xl bg-inverse-surface/40"
// //       style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUmLy8G6Mkpr2MHBnmreJXZpIMZ6-ybcvNsoccP5n0X_tgXcFXnC4Y4Bp1QU4Mpg5uONRga0Lmz1r_KOf2vFV_wXv5rBa2zYecsgNZQbTGun8yn06lGUTbQdpkZ5zDNGFsyxNqTqmxOlMD-I9S4AqMJyHdoknU6KmqaWRRipqSEL0UfQNEVe6R9nctBZQaYjO7swESY2NX5MkXgBeEFUD2g8GfETA5KeYL--6GrCDW5GEz0GGVWJ0Wwgp366-h0CQmHRKTrGD4Lfs')" }}
// //     />
// //     <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
// //     <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent"></div>
// //   </div>
  
// //   <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white max-w-[1600px]">
    
// //     <h2 className="text-base md:text-lg lg:text-[22px] font-medium w-full mx-auto leading-relaxed md:leading-snug tracking-wide">
      
// //       <span className="block lg:inline-block">
// //         Join hundreds of forward-thinking tile businesses using AI-powered 3D visualization to help customers choose
// //       </span>
      
// //       <span className="block mt-1 md:mt-1.5 text-white/90">
// //         with confidence and increase showroom conversions.
// //       </span>
      
// //     </h2>
// //   </div>
// // </section>
// //       </main>

// //       {/* ✅ FOOTER - MATCHING WIDTH */}
// //       {/* <footer className="bg-surface-container-low border-t border-outline-variant/30">
// //         <div className="max-w-[1800px] mx-auto px-3 md:px-5 py-8">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-3">
// //                 <img alt="Logo" className="h-8 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida/AP1WRLvyx1wURSmrzX5ul0t2vQ8aBshaKymLVrexE8a4wVcx7hE9IjLaMZUqPTDdznaHSBwK3XvURG2nIW_zkma-oYS7AFEV_KYVZkBQP3P-cMYs1tv0s-NQw1jqjIpkRV0Zpvm6Fl61U61IBgbrmJICuaM1CBBfVuRq2VDVgK4WkFLCzLbOp80V9UwxJR66L5b_C9ZUelWeuQX9OayYAEjrcKahWVuG3N5HETtk-_q-GjJ71l_PmCcid1dYCYS8" />
// //                 <span className="font-semibold text-on-surface">VirtuThings AI</span>
// //               </div>
// //               <p className="text-on-surface-variant text-sm max-w-xs">
// //                 Empowering architecture and real estate with hyper-realistic AI visualizations.
// //               </p>
// //             </div>
// //             <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-x-12 gap-y-6">
// //               {['Privacy Policy', 'Terms of Service', 'Partner Agreement', 'Contact'].map((link) => (
// //                 <a key={link} className="text-sm uppercase text-on-surface-variant hover:text-secondary transition-colors" href="#">
// //                   {link}
// //                 </a>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
// //             <p className="text-sm text-on-surface-variant">© 2024 VirtuThings AI. All rights reserved.</p>
// //             <div className="flex gap-6">
// //               <MaterialIcon name="public" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// //               <MaterialIcon name="mail" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// //               <MaterialIcon name="share" className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
// //             </div>
// //           </div>
// //         </div>
// //       </footer> */} 
// //       <Footer/>

// //       {/* ✅ STYLES */}
// //       <style>{`
// //         .glass-card {
// //           background: rgba(255, 255, 255, 0.4);
// //           backdrop-filter: blur(20px);
// //           -webkit-backdrop-filter: blur(20px);
// //           border: 1px solid rgba(255, 255, 255, 0.6);
// //         }
// //         .ai-shimmer {
// //           position: relative;
// //           overflow: hidden;
// //         }
// //         .ai-shimmer::after {
// //           content: "";
// //           position: absolute;
// //           top: -50%;
// //           left: -50%;
// //           width: 200%;
// //           height: 200%;
// //           background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%);
// //           animation: shimmer 4s infinite linear;
// //         }
// //         @keyframes shimmer {
// //           0% { transform: translate(-30%, -30%); }
// //           100% { transform: translate(30%, 30%); }
// //         }
// //         .material-symbols-outlined {
// //           font-family: 'Material Symbols Outlined';
// //           font-weight: normal;
// //           font-style: normal;
// //           font-size: 24px;
// //           line-height: 1;
// //           letter-spacing: normal;
// //           text-transform: none;
// //           display: inline-block;
// //           white-space: nowrap;
// //           word-wrap: normal;
// //           direction: ltr;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };  
// import React, { useState, useEffect, useRef, memo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../lib/firebase';
// import { X, Menu } from 'lucide-react';
// import Footer from './Footer';

// interface FormData {
//   businessName: string;
//   businessType: string;
//   ownerName: string;
//   phone: string;
//   businessAddress: string;
//   city: string;
//   state: string;
//   pincode: string;
//   email: string;
//   numberOfBranches: string;
//   additionalInfo: string;
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ MATERIAL ICONS COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// const MaterialIcon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
//   <span 
//     className={`material-symbols-outlined ${className}`}
//     style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
//   >
//     {name}
//   </span>
// );

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ MEMOIZED INPUT FIELD COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// const InputField = memo(({ 
//   label, 
//   type = 'text',
//   value, 
//   onChange, 
//   placeholder, 
//   error, 
//   checkMessage,
//   checking,
//   exists,
//   required = false,
//   maxLength,
//   options,
//   description
// }: any) => {
//   const isSelect = type === 'select';
  
//   return (
//     <div className="space-y-2 flex flex-col justify-start">
//       <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
//         {label} {required && '*'}
//       </label>
      
//       {/* Description moved below the input to keep input boxes aligned */}
      
//       <div className="relative">
//         {isSelect ? (
//           <select
//             value={value}
//             onChange={onChange}
//             className="w-full px-4 py-3 bg-surface rounded-xl border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all outline-none text-body-md appearance-none cursor-pointer"
//             required={required}
//           >
//             {options?.map((opt: string) => (
//               <option key={opt} value={opt}>{opt}</option>
//             ))}
//           </select>
//         ) : (
//           <input
//             type={type}
//             value={value}
//             onChange={onChange}
//             className={`
//               w-full px-4 py-3 rounded-xl border-none ring-1 transition-all outline-none text-body-md
//               ${error 
//                 ? 'ring-2 ring-red-500 bg-red-50' 
//                 : exists
//                 ? 'ring-2 ring-red-500 bg-red-50'
//                 : checking
//                 ? 'ring-2 ring-blue-500 bg-blue-50 animate-pulse'
//                 : checkMessage && !error
//                 ? 'ring-2 ring-green-500 bg-green-50'
//                 : 'ring-outline-variant focus:ring-2 focus:ring-primary bg-surface'
//               }
//             `}
//             placeholder={placeholder}
//             required={required}
//             maxLength={maxLength}
//           />
//         )}
        
//         {!isSelect && (checking || checkMessage) && (
//           <div className="absolute right-3 top-1/2 -translate-y-1/2">
//             {checking && (
//               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             )}
//             {!checking && checkMessage && !exists && !error && (
//               <MaterialIcon name="check_circle" filled className="text-green-600 text-2xl" />
//             )}
//             {!checking && exists && (
//               <MaterialIcon name="cancel" filled className="text-red-600 text-2xl" />
//             )}
//           </div>
//         )}
//       </div>

//       {/* Helper text / Description rendered here */}
//       {description && !error && (
//         <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>
//       )}
      
//       {error && (
//         <p className="text-red-600 text-sm font-medium flex items-start gap-1.5 mt-1">
//           <MaterialIcon name="error" className="text-lg" />
//           <span>{error}</span>
//         </p>
//       )}
      
//       {checkMessage && !error && (
//         <p className={`text-sm font-medium mt-1 ${checking ? 'text-blue-700' : exists ? 'text-red-700' : 'text-green-700'}`}>
//           {checkMessage}
//         </p>
//       )}
//     </div>
//   );
// });

// InputField.displayName = 'InputField';

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ MAIN SELLER REQUEST FORM COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// export const SellerRequestForm: React.FC = () => {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState<FormData>(() => {
//     const saved = localStorage.getItem('sellerRequestDraft');
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch {
//         return {
//           businessName: '',
//           businessType: 'Tile Showroom',
//           ownerName: '',
//           phone: '',
//           businessAddress: '',
//           city: '',
//           state: '',
//           pincode: '',
//           email: '',
//           numberOfBranches: '1',
//           additionalInfo: ''
//         };
//       }
//     }
//     return {
//       businessName: '',
//       businessType: 'Tile Showroom',
//       ownerName: '',
//       phone: '',
//       businessAddress: '',
//       city: '',
//       state: '',
//       pincode: '',
//       email: '',
//       numberOfBranches: '1',
//       additionalInfo: ''
//     };
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [businessNameError, setBusinessNameError] = useState('');
//   const [pincodeError, setPincodeError] = useState('');
//   const [domainSuggestion, setDomainSuggestion] = useState('');

//   const [checkingEmail, setCheckingEmail] = useState(false);
//   const [emailExists, setEmailExists] = useState(false);
//   const [emailCheckMessage, setEmailCheckMessage] = useState('');
  
//   const [checkingPhone, setCheckingPhone] = useState(false);
//   const [phoneExists, setPhoneExists] = useState(false);
//   const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

//   const [checkingBusinessName, setCheckingBusinessName] = useState(false);
//   const [businessNameExists, setBusinessNameExists] = useState(false);
//   const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState('');
  
//   const lastCheckedEmail = useRef('');
//   const lastCheckedPhone = useRef('');
//   const lastCheckedBusinessName = useRef('');
//   const checkInProgress = useRef(false);
//   const lastSubmitTime = useRef(0);
//   const SUBMIT_COOLDOWN = 5000;

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ VALIDATION FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════════════════

//   const validateEmail = (email: string): boolean => {
//     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!regex.test(email)) return false;
//     const parts = email.split('@');
//     if (parts.length !== 2) return false;
//     if (parts[0].length === 0 || parts[1].length === 0) return false;
//     if (!parts[1].includes('.')) return false;
//     return true;
//   };

//   const validateEmailDomain = (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
//     const commonTypos: Record<string, string> = {
//       'gmali.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
//       'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmial.com': 'gmail.com',
//       'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahho.com': 'yahoo.com',
//       'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
//       'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com'
//     };
    
//     const parts = email.split('@');
//     if (parts.length !== 2) return { isValid: false, hasTypo: false };
    
//     const domain = parts[1]?.toLowerCase();
//     if (!domain) return { isValid: false, hasTypo: false };
    
//     if (commonTypos[domain]) {
//       return { isValid: false, suggestion: parts[0] + '@' + commonTypos[domain], hasTypo: true };
//     }
    
//     return { isValid: true, hasTypo: false };
//   };

//   const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
//     const cleaned = phone.replace(/\D/g, '');
//     if (!cleaned) return { isValid: false, error: 'Phone number required' };
//     if (cleaned.length !== 10) return { isValid: false, error: 'Must be exactly 10 digits' };
//     if (!/^[6-9]/.test(cleaned)) return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
//     return { isValid: true };
//   };

//   const validatePincode = (pincode: string): { isValid: boolean; error?: string } => {
//     const cleaned = pincode.replace(/\D/g, '');
//     if (!cleaned) return { isValid: false, error: 'Pincode required' };
//     if (cleaned.length !== 6) return { isValid: false, error: 'Must be 6 digits' };
//     return { isValid: true };
//   };

//   const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
//     if (!name.trim()) return { isValid: false, error: 'Owner name required' };
//     if (name.trim().length < 2) return { isValid: false, error: 'At least 2 characters required' };
//     if (/\d/.test(name)) return { isValid: false, error: 'Cannot contain numbers' };
//     if (!/^[a-zA-Z\s]+$/.test(name)) return { isValid: false, error: 'Only letters and spaces allowed' };
//     return { isValid: true };
//   };

//   const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
//     if (!name.trim()) return { isValid: false, error: 'Business name required' };
//     if (name.trim().length < 3) return { isValid: false, error: 'At least 3 characters required' };
//     if (name.trim().length > 100) return { isValid: false, error: 'Maximum 100 characters allowed' };
//     return { isValid: true };
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ DATABASE CHECK FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════════════════

//   const checkEmailExists = async (email: string): Promise<boolean> => {
//     if (checkInProgress.current || !email || !validateEmail(email)) return false;

//     const domainCheck = validateEmailDomain(email);
//     if (domainCheck.hasTypo && domainCheck.suggestion) {
//       setDomainSuggestion(domainCheck.suggestion);
//       setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
//       setEmailExists(false);
//       setEmailCheckMessage('❌ Invalid domain');
//       return false;
//     } else {
//       setDomainSuggestion('');
//     }

//     checkInProgress.current = true;
//     setCheckingEmail(true);
//     setEmailCheckMessage('🔍 Checking...');

//     try {
//       const emailToCheck = email.toLowerCase().trim();

//       const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
//       const sellersSnapshot = await getDocs(sellersQuery);
      
//       if (sellersSnapshot.size > 0) {
//         setEmailExists(true);
//         setEmailCheckMessage('❌ Already registered');
//         setEmailError('Email already registered');
//         setCheckingEmail(false);
//         checkInProgress.current = false;
//         lastCheckedEmail.current = emailToCheck;
//         return true;
//       }

//       const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
//       const requestsSnapshot = await getDocs(requestsQuery);
      
//       if (requestsSnapshot.size > 0) {
//         const status = requestsSnapshot.docs[0].data().status;
//         if (status === 'pending') {
//           setEmailExists(true);
//           setEmailCheckMessage('⏳ Request pending');
//           setEmailError('Request already pending');
//         } else if (status === 'approved') {
//           setEmailExists(true);
//           setEmailCheckMessage('✅ Already approved');
//           setEmailError('Account already exists');
//         } else {
//           setEmailExists(false);
//           setEmailCheckMessage('⚠️ Can reapply');
//           setEmailError('');
//         }
//         setCheckingEmail(false);
//         checkInProgress.current = false;
//         lastCheckedEmail.current = emailToCheck;
//         return status === 'pending' || status === 'approved';
//       }

//       setEmailExists(false);
//       setEmailCheckMessage('✅ Available');
//       setEmailError('');
//       setCheckingEmail(false);
//       checkInProgress.current = false;
//       lastCheckedEmail.current = emailToCheck;
//       return false;

//     } catch (error) {
//       console.error('Email check error:', error);
//       setEmailCheckMessage('⚠️ Check failed');
//       setEmailExists(false);
//       setCheckingEmail(false);
//       checkInProgress.current = false;
//       return false;
//     }
//   };

//   const checkPhoneExists = async (phone: string): Promise<boolean> => {
//     const cleaned = phone.replace(/\D/g, '');
//     if (!cleaned || cleaned.length !== 10) return false;
//     if (lastCheckedPhone.current === cleaned) return phoneExists;

//     setCheckingPhone(true);
//     setPhoneCheckMessage('🔍 Checking...');

//     try {
//       const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
//       const sellersSnapshot = await getDocs(sellersQuery);
      
//       if (sellersSnapshot.size > 0) {
//         setPhoneExists(true);
//         setPhoneCheckMessage('❌ Already registered');
//         setPhoneError('Phone already in use');
//         setCheckingPhone(false);
//         lastCheckedPhone.current = cleaned;
//         return true;
//       }

//       const requestsQuery = query(collection(db, 'sellerRequests'), where('phone', '==', cleaned));
//       const requestsSnapshot = await getDocs(requestsQuery);
      
//       if (requestsSnapshot.size > 0) {
//         const status = requestsSnapshot.docs[0].data().status;
//         if (status === 'pending' || status === 'approved') {
//           setPhoneExists(true);
//           setPhoneCheckMessage('❌ Phone in use');
//           setPhoneError('Phone already registered');
//           setCheckingPhone(false);
//           lastCheckedPhone.current = cleaned;
//           return true;
//         }
//       }

//       setPhoneExists(false);
//       setPhoneCheckMessage('✅ Available');
//       setPhoneError('');
//       setCheckingPhone(false);
//       lastCheckedPhone.current = cleaned;
//       return false;

//     } catch (error) {
//       console.error('Phone check error:', error);
//       setPhoneCheckMessage('');
//       setPhoneExists(false);
//       setCheckingPhone(false);
//       return false;
//     }
//   };

//   const checkBusinessNameExists = async (name: string): Promise<boolean> => {
//     const normalized = name.toLowerCase().trim();
//     if (!normalized || normalized.length < 3) return false;
//     if (lastCheckedBusinessName.current === normalized) return businessNameExists;

//     setCheckingBusinessName(true);
//     setBusinessNameCheckMessage('🔍 Checking...');

//     try {
//       const sellersQuery = query(collection(db, 'sellers'), where('businessName', '==', normalized));
//       const sellersSnapshot = await getDocs(sellersQuery);
      
//       if (sellersSnapshot.size > 0) {
//         setBusinessNameExists(true);
//         setBusinessNameCheckMessage('⚠️ Similar name exists');
//         setBusinessNameError('Consider using a unique name');
//         setCheckingBusinessName(false);
//         lastCheckedBusinessName.current = normalized;
//         return true;
//       }

//       setBusinessNameExists(false);
//       setBusinessNameCheckMessage('✅ Unique');
//       setBusinessNameError('');
//       setCheckingBusinessName(false);
//       lastCheckedBusinessName.current = normalized;
//       return false;

//     } catch (error) {
//       console.error('Business name check error:', error);
//       setBusinessNameCheckMessage('');
//       setBusinessNameExists(false);
//       setCheckingBusinessName(false);
//       return false;
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ DEBOUNCED CHECKS
//   // ═══════════════════════════════════════════════════════════════════════════

//   useEffect(() => {
//     if (!formData.email) {
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       setEmailError('');
//       setDomainSuggestion('');
//       return;
//     }

//     if (!validateEmail(formData.email)) {
//       setEmailExists(false);
//       setEmailCheckMessage('');
//       if (!formData.email.includes('@')) setEmailError('Email must contain @');
//       return;
//     }

//     if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) return;

//     const timer = setTimeout(() => {
//       checkEmailExists(formData.email);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, [formData.email]);

//   useEffect(() => {
//     const cleaned = formData.phone.replace(/\D/g, '');
//     if (!cleaned || cleaned.length !== 10) {
//       setPhoneExists(false);
//       setPhoneCheckMessage('');
//       return;
//     }

//     if (lastCheckedPhone.current === cleaned) return;

//     const timer = setTimeout(() => {
//       checkPhoneExists(formData.phone);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [formData.phone]);

//   useEffect(() => {
//     const normalized = formData.businessName.toLowerCase().trim();
//     if (!normalized || normalized.length < 3) {
//       setBusinessNameExists(false);
//       setBusinessNameCheckMessage('');
//       return;
//     }

//     if (lastCheckedBusinessName.current === normalized) return;

//     const timer = setTimeout(() => {
//       checkBusinessNameExists(formData.businessName);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [formData.businessName]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ LOCAL STORAGE SAVE
//   // ═══════════════════════════════════════════════════════════════════════════

//   useEffect(() => {
//     if (!submitted) {
//       const timer = setTimeout(() => {
//         localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [formData, submitted]);

//   useEffect(() => {
//     if (submitted) {
//       localStorage.removeItem('sellerRequestDraft');
//     }
//   }, [submitted]);

//   useEffect(() => {
//     if (mobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [mobileMenuOpen]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ INPUT CHANGE HANDLER
//   // ═══════════════════════════════════════════════════════════════════════════

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     if (error) setError('');
    
//     if (field === 'email') {
//       setEmailCheckMessage('');
//       setEmailExists(false);
//       setDomainSuggestion('');
//       lastCheckedEmail.current = '';
//       if (emailError) setEmailError('');
//     }
    
//     if (field === 'phone') {
//       setPhoneCheckMessage('');
//       setPhoneExists(false);
//       lastCheckedPhone.current = '';
//       if (phoneError) setPhoneError('');
//       if (value) {
//         const validation = validatePhone(value);
//         if (!validation.isValid) setPhoneError(validation.error || 'Invalid');
//       }
//     }
    
//     if (field === 'businessName') {
//       setBusinessNameCheckMessage('');
//       setBusinessNameExists(false);
//       lastCheckedBusinessName.current = '';
//       if (businessNameError) setBusinessNameError('');
//       if (value) {
//         const validation = validateBusinessName(value);
//         if (!validation.isValid) setBusinessNameError(validation.error || 'Invalid');
//       }
//     }
    
//     if (field === 'ownerName') {
//       if (nameError) setNameError('');
//       if (value) {
//         const validation = validateOwnerName(value);
//         if (!validation.isValid) setNameError(validation.error || 'Invalid');
//       }
//     }

//     if (field === 'pincode') {
//       if (pincodeError) setPincodeError('');
//       if (value) {
//         const validation = validatePincode(value);
//         if (!validation.isValid) setPincodeError(validation.error || 'Invalid');
//       }
//     }
//   };

//   const useSuggestedEmail = () => {
//     if (domainSuggestion) {
//       setFormData(prev => ({ ...prev, email: domainSuggestion }));
//       setDomainSuggestion('');
//       setEmailError('');
//       setEmailCheckMessage('');
//       lastCheckedEmail.current = '';
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ FORM VALIDATION
//   // ═══════════════════════════════════════════════════════════════════════════

//   const validateForm = (): boolean => {
//     const businessValidation = validateBusinessName(formData.businessName);
//     if (!businessValidation.isValid) {
//       setBusinessNameError(businessValidation.error || 'Invalid');
//       setError('Please fix business name');
//       return false;
//     }
    
//     const nameValidation = validateOwnerName(formData.ownerName);
//     if (!nameValidation.isValid) {
//       setNameError(nameValidation.error || 'Invalid');
//       setError('Please fix owner name');
//       return false;
//     }
    
//     if (!formData.email || !validateEmail(formData.email)) {
//       setEmailError('Enter a valid email address');
//       setError('Email is required and must be valid');
//       return false;
//     }

//     const domainCheck = validateEmailDomain(formData.email);
//     if (domainCheck.hasTypo) {
//       setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
//       setError(`Email typo detected!`);
//       setDomainSuggestion(domainCheck.suggestion || '');
//       return false;
//     }

//     const phoneValidation = validatePhone(formData.phone);
//     if (!phoneValidation.isValid) {
//       setPhoneError(phoneValidation.error || 'Invalid');
//       setError('Please fix phone number');
//       return false;
//     }

//     const pincodeValidation = validatePincode(formData.pincode);
//     if (!pincodeValidation.isValid) {
//       setPincodeError(pincodeValidation.error || 'Invalid');
//       setError('Please fix pincode');
//       return false;
//     }
    
//     if (!formData.businessAddress.trim()) {
//       setError('Business address required');
//       return false;
//     }

//     if (!formData.city.trim()) {
//       setError('City required');
//       return false;
//     }

//     if (!formData.state.trim()) {
//       setError('State required');
//       return false;
//     }
    
//     return true;
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ FORM SUBMIT
//   // ═══════════════════════════════════════════════════════════════════════════

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const now = Date.now();
//     if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
//       const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
//       alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
//       return;
//     }

//     if (checkingEmail || checkingPhone || checkInProgress.current) {
//       alert('⏳ Please wait! Email/Phone verification in progress.');
//       return;
//     }

//     if (domainSuggestion) {
//       alert(`❌ Invalid Email Domain!\n\nPlease use: ${domainSuggestion}`);
//       return;
//     }

//     if (!validateForm()) return;

//     setSubmitting(true);
//     setError('Final verification...');

//     try {
//       const emailIsRegistered = await checkEmailExists(formData.email);
//       if (emailIsRegistered) {
//         setError('❌ Email already registered');
//         alert('❌ Email Already Registered!');
//         setSubmitting(false);
//         return;
//       }

//       const phoneIsRegistered = await checkPhoneExists(formData.phone);
//       if (phoneIsRegistered) {
//         setError('❌ Phone already registered');
//         alert('❌ Phone Already Registered!');
//         setSubmitting(false);
//         return;
//       }

//       setError('');
//     } catch (err) {
//       console.error('Verification error:', err);
//       setError('Verification failed. Try again.');
//       setSubmitting(false);
//       return;
//     }

//     if (emailExists || phoneExists) {
//       alert('❌ Cannot Submit! Duplicate data found.');
//       setSubmitting(false);
//       return;
//     }

//     try {
//       await addDoc(collection(db, 'sellerRequests'), {
//         businessName: formData.businessName.trim(),
//         businessType: formData.businessType,
//         ownerName: formData.ownerName.trim(),
//         email: formData.email.toLowerCase().trim(),
//         phone: formData.phone.replace(/\D/g, ''),
//         businessAddress: formData.businessAddress.trim(),
//         city: formData.city.trim(),
//         state: formData.state.trim(),
//         pincode: formData.pincode.replace(/\D/g, ''),
//         numberOfBranches: formData.numberOfBranches,
//         additionalInfo: formData.additionalInfo.trim() || null,
//         status: 'pending',
//         requestedAt: new Date().toISOString(),
//         adminNotes: null,
//         reviewedAt: null,
//         reviewedBy: null,
//         emailDeliveryStatus: null,
//         accountCreated: false
//       });

//       lastSubmitTime.current = Date.now();
//       setSubmitted(true);
      
//     } catch (err: any) {
//       console.error('Firestore error:', err);
//       if (err.code === 'permission-denied') {
//         setError('❌ Permission denied. Contact support.');
//       } else {
//         setError('❌ Submission failed. Try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ SUCCESS SCREEN
//   // ═══════════════════════════════════════════════════════════════════════════

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border-2 border-green-400">
//           <div className="mb-6">
//             <MaterialIcon name="check_circle" filled className="text-green-600 text-8xl mx-auto animate-bounce" />
//           </div>
          
//           <h3 className="text-4xl font-bold text-green-800 mb-4">
//             ✅ Request Submitted Successfully!
//           </h3>
          
//           <p className="text-xl text-green-700 mb-8">
//             Thank you <strong>{formData.ownerName}</strong>!
//           </p>
          
//           <div className="bg-gray-50 rounded-2xl p-8 text-left border-2 border-gray-200">
//             <h4 className="font-bold text-gray-900 mb-5 text-xl flex items-center gap-3">
//               <MaterialIcon name="info" filled className="text-blue-600 text-3xl" />
//               What's Next?
//             </h4>
            
//             <ul className="space-y-4 text-gray-700">
//               <li className="flex items-start gap-3">
//                 <MaterialIcon name="schedule" filled className="text-green-600 text-2xl flex-shrink-0" />
//                 <span>Review in <strong>2-3 business days</strong></span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <MaterialIcon name="mail" filled className="text-green-600 text-2xl flex-shrink-0" />
//                 <span className="break-all">Updates to: <strong>{formData.email}</strong></span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <MaterialIcon name="verified" filled className="text-green-600 text-2xl flex-shrink-0" />
//                 <span>Login credentials if <strong>approved</strong></span>
//               </li>
//             </ul>
//           </div>
          
//           <div className="mt-8 bg-gray-100 rounded-xl p-5 inline-block">
//             <p className="text-sm text-gray-600 mb-2">Reference ID</p>
//             <p className="text-2xl font-mono font-bold text-gray-900">
//               REQ-{Date.now().toString().slice(-8)}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ MAIN FORM UI
//   // ═══════════════════════════════════════════════════════════════════════════

//   return (
//     <div className="min-h-screen bg-background">
      
// {/* ✅ NAVIGATION BAR - CLEAN & RESPONSIVE */}
//       <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
//         <div className="w-full max-w-[1800px] mx-auto px-4 md:px-5 py-4 lg:py-6 flex items-center justify-between relative">
          
//           {/* Logo */}
//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
//             <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
//               <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
//               <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
//             </div>
//             <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
//               Tilesview360
//             </span>
//           </div>

//           {/* Right Action - Back to Home (Visible on ALL devices) */}
//           <div className="flex items-center">
//             <button 
//               onClick={() => navigate('/')}
//               className="bg-[#0040DF] text-white text-[14px] sm:text-[16px] xl:text-[18px] px-5 sm:px-6 xl:px-7 py-2.5 sm:py-3 xl:py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
//             >
//               Back to Home
//             </button>
//           </div>

//         </div>
//       </nav>

//       <main className="pt-20">
        
//         {/* ✅ HERO SECTION */}
//         <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden">
//           <div className="absolute inset-0 z-0">
//             <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10"></div>
//             <div 
//               className="w-full h-full bg-cover bg-center opacity-30" 
//               style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAroFBavzMYbVtTnj6guHgLgiyRbS4brV2u8LcZRQIewhnEoEWX-C1xnGPMUyOGA_zhWpDcCV_c4lZtco2thvCgItp-fZZOncdfueG4x-CyWT6kd0vIAU6sUE5-hLla2x2-te7Ohikf83acy5pr4_sQRWLe-4_Acr5geqgmLQTrKNEqahOlu4vVSxq-6flte9fsSJ0xBvmnduC6LSX1L8trOUIFTYv46Oyx080w0vIn9uu-7WBvva6OQMA0RI-Ez8-Qv7ebcagl4WKg')" }}
//             />
//           </div>
          
//           <div className="container mx-auto px-3 md:px-5 max-w-[1800px] relative z-20 py-16 md:py-20 lg:py-24">
//             <div className="max-w-4xl">
//               <h1 className="text-[44px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface mb-8 lg:mb-10">
//                 Transform Your Tile Showroom Into a <span className="text-primary">Smart Experience</span>
//               </h1>
              
//               <p className="text-[17px] md:text-[19px] lg:text-[21px] text-on-surface-variant mb-12 lg:mb-16 leading-relaxed max-w-2xl">
//                 Help customers visualize every tile before they buy, increase confidence, and close more sales with AI-powered 3D visualization.
//               </p>
              
//               <div className="flex flex-wrap gap-4 md:gap-6">
//                 <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
//                   <MaterialIcon name="store" filled className="text-primary text-2xl" />
//                   <span className="text-[14px] md:text-[15px] font-bold uppercase">Trusted by Dealers</span>
//                 </div>
//                 <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
//                   <MaterialIcon name="view_in_ar" filled className="text-secondary text-2xl" />
//                   <span className="text-[14px] md:text-[15px] font-bold uppercase">Realistic 3D Preview</span>
//                 </div>
//                 <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
//                   <MaterialIcon name="qr_code_2" filled className="text-primary text-2xl" />
//                   <span className="text-[14px] md:text-[15px] font-bold uppercase">QR Powered Catalog</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ✅ FORM & FEATURES SECTION */}
//         <section className="py-24 bg-surface-container-lowest">
//           <div className="container mx-auto px-3 md:px-5 max-w-[1800px]">
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 xl:gap-32 items-start">
              
//               {/* LEFT: FORM */}
//               <div className="lg:col-span-7">
//                 <div className="glass-card p-10 md:p-14 rounded-3xl shadow-xl">
//                   <div className="mb-12 p-6 bg-primary/10 border-l-4 border-primary rounded-lg">
//                     <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
//                       Become a <span className="text-primary">Tilesview360 Partner</span>
//                     </h2>
//                   </div>

//                   {error && (
//                     <div className="mb-8 p-5 bg-red-50 border-2 border-red-400 rounded-xl flex items-start gap-4">
//                       <MaterialIcon name="error" className="text-red-600 text-3xl flex-shrink-0" />
//                       <span className="text-red-900 font-semibold text-lg">{error}</span>
//                     </div>
//                   )}

//                   <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Business Name & Type */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <InputField
//                         label="Business Name"
//                         value={formData.businessName}
//                         onChange={(e: any) => handleInputChange('businessName', e.target.value)}
//                         placeholder="Enter your business name"
//                         error={businessNameError}
//                         checkMessage={businessNameCheckMessage}
//                         checking={checkingBusinessName}
//                         exists={businessNameExists}
//                         required
//                       />
//                       <InputField
//                         label="Business Type"
//                         type="select"
//                         value={formData.businessType}
//                         onChange={(e: any) => handleInputChange('businessType', e.target.value)}
//                         options={['Tile Showroom', 'Tile Distributor', 'Tile Manufacturer', 'Builder', 'Interior Studio']}
//                       />
//                     </div>

//                     {/* Owner Name & Contact */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <InputField
//                         label="Owner Name"
//                         value={formData.ownerName}
//                         onChange={(e: any) => handleInputChange('ownerName', e.target.value)}
//                         placeholder="Full name of owner"
//                         error={nameError}
//                         required
//                       />
//                       <InputField
//                         label="Contact Number"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e: any) => handleInputChange('phone', e.target.value)}
//                         placeholder="9876543210"
//                         error={phoneError}
//                         checkMessage={phoneCheckMessage}
//                         checking={checkingPhone}
//                         exists={phoneExists}
//                         maxLength={10}
//                         required
//                       />
//                     </div>

//                     {/* Business Address */}
//                     <InputField
//                       label="Business Address"
//                       value={formData.businessAddress}
//                       onChange={(e: any) => handleInputChange('businessAddress', e.target.value)}
//                       placeholder="Showroom street address"
//                       required
//                     />

//                     {/* City, State, Pincode */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                       <InputField
//                         label="City"
//                         value={formData.city}
//                         onChange={(e: any) => handleInputChange('city', e.target.value)}
//                         placeholder="City"
//                         required
//                       />
//                       <InputField
//                         label="State"
//                         value={formData.state}
//                         onChange={(e: any) => handleInputChange('state', e.target.value)}
//                         placeholder="State"
//                         required
//                       />
//                       <InputField
//                         label="Pincode"
//                         value={formData.pincode}
//                         onChange={(e: any) => handleInputChange('pincode', e.target.value)}
//                         placeholder="123456"
//                         error={pincodeError}
//                         maxLength={6}
//                         required
//                       />
//                     </div>

//                     {/* Email & Branches */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
//                       <InputField
//                         label="Business Email"
//                         type="email"
//                         value={formData.email}
//                         onChange={(e: any) => handleInputChange('email', e.target.value)}
//                         placeholder="contact@business.com"
//                         error={emailError}
//                         checkMessage={emailCheckMessage}
//                         checking={checkingEmail}
//                         exists={emailExists}
//                         required
//                         description="Must be valid (e.g., name@gmail.com)"
//                       />
//                       <InputField
//                         label="Number of Branches"
//                         type="select"
//                         value={formData.numberOfBranches}
//                         onChange={(e: any) => handleInputChange('numberOfBranches', e.target.value)}
//                         options={['1', '2–5', '5+']}
//                       />
//                     </div>

//                     {/* Domain Suggestion */}
//                     {domainSuggestion && (
//                       <div className="p-6 rounded-xl bg-red-50 border-2 border-red-400">
//                         <p className="text-red-900 font-bold mb-3 text-xl">❌ Invalid Email Domain!</p>
//                         <p className="text-red-800 text-base mb-4">
//                           You typed: <strong className="text-lg">{formData.email}</strong><br />
//                           Did you mean: <strong className="text-green-700 text-lg">{domainSuggestion}</strong>?
//                         </p>
//                         <button
//                           type="button"
//                           onClick={useSuggestedEmail}
//                           className="w-full bg-green-600 text-white px-5 py-4 rounded-lg hover:bg-green-700 font-bold text-lg"
//                         >
//                           ✅ Use {domainSuggestion}
//                         </button>
//                       </div>
//                     )}

//                     {/* Submit Button */}
//                     <button
//                       type="submit"
//                       disabled={
//                         submitting || 
//                         checkingEmail || 
//                         checkingPhone ||
//                         emailExists || 
//                         phoneExists ||
//                         !!emailError || 
//                         !!phoneError ||
//                         !!domainSuggestion
//                       }
//                       className="w-full py-5 bg-primary text-white font-bold rounded-2xl text-xl shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all ai-shimmer relative overflow-hidden"
//                     >
//                       {submitting ? (
//                         <span className="flex items-center justify-center gap-3">
//                           <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           Submitting...
//                         </span>
//                       ) : checkingEmail || checkingPhone ? (
//                         'Verifying...'
//                       ) : (
//                         'Start My Partnership'
//                       )}
//                     </button>
//                   </form>

//                   {/* Benefits */}
//                   <div className="mt-14 pt-10 border-t border-outline-variant/30">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       {['Free onboarding', 'Secure business info', 'Setup assistance', 'No tech expertise'].map((benefit) => (
//                         <div key={benefit} className="flex items-center gap-3 text-on-surface-variant">
//                           <MaterialIcon name="check_circle" filled className="text-primary text-3xl" />
//                           <span className="text-base font-bold uppercase">{benefit}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT: FEATURES (Added lg:pt-14 here for proper alignment) */}
//               <div className="lg:col-span-5 space-y-10 lg:pt-14">
//                 <h3 className="text-3xl md:text-4xl font-bold text-on-surface">Why Join Tilesview360?</h3>
                
//                 <div className="grid grid-cols-1 gap-6">
//                   {/* Feature 1 - Increase Sales */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="trending_up" className="text-primary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Increase Sales</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Customers can preview tiles in high-fidelity environments before purchasing, reducing decision fatigue.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Feature 2 - Realistic 3D Visualization */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="architecture" className="text-secondary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Realistic 3D Visualization</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Real-time rendering of Kitchen, Bathroom, and Living Room scenes with your exact inventory.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Feature 3 - Digital Tile Catalog */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="menu_book" className="text-tertiary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Digital Tile Catalog</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Let workers scan any tile QR in your showroom to visualize it instantly on the device.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Feature 4 - Business Insights */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="analytics" className="text-primary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Business Insights</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Track customer preferences and showroom activity with comprehensive AI-driven analytics dashboards.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Feature 5 - Cloud Backup */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="cloud_done" className="text-secondary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Cloud Backup</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Securely access your inventory and customer designs across all showroom tablets and devices.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Feature 6 - Dedicated Support */}
//                   <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
//                     <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                       <MaterialIcon name="support_agent" className="text-tertiary text-3xl" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-on-surface mb-2 text-xl">Dedicated Support</h4>
//                       <p className="text-base text-on-surface-variant leading-relaxed">
//                         Direct access to technical training and onboarding for your sales team to maximize ROI.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ✅ CTA SECTION */}
//         <section className="py-32 md:py-44 relative overflow-hidden bg-surface-dim">
//           <div className="absolute inset-0 z-0">
//             <div 
//               className="w-full h-full bg-cover bg-center backdrop-blur-xl bg-inverse-surface/40"
//               style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUmLy8G6Mkpr2MHBnmreJXZpIMZ6-ybcvNsoccP5n0X_tgXcFXnC4Y4Bp1QU4Mpg5uONRga0Lmz1r_KOf2vFV_wXv5rBa2zYecsgNZQbTGun8yn06lGUTbQdpkZ5zDNGFsyxNqTqmxOlMD-I9S4AqMJyHdoknU6KmqaWRRipqSEL0UfQNEVe6R9nctBZQaYjO7swESY2NX5MkXgBeEFUD2g8GfETA5KeYL--6GrCDW5GEz0GGVWJ0Wwgp366-h0CQmHRKTrGD4Lfs')" }}
//             />
//             <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
//             <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent"></div>
//           </div>
          
//           <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white max-w-[1600px]">
            
//             <h2 className="text-base md:text-lg lg:text-[22px] font-medium w-full mx-auto leading-relaxed md:leading-snug tracking-wide">
              
//               <span className="block lg:inline-block">
//                 Join hundreds of forward-thinking tile businesses using AI-powered 3D visualization to help customers choose
//               </span>
              
//               <span className="block mt-1 md:mt-1.5 text-white/90">
//                 with confidence and increase showroom conversions.
//               </span>
              
//             </h2>
//           </div>
//         </section>
//       </main>

//       <Footer/>

//       {/* ✅ STYLES */}
//       <style>{`
//         .glass-card {
//           background: rgba(255, 255, 255, 0.4);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.6);
//         }
//         .ai-shimmer {
//           position: relative;
//           overflow: hidden;
//         }
//         .ai-shimmer::after {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -50%;
//           width: 200%;
//           height: 200%;
//           background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%);
//           animation: shimmer 4s infinite linear;
//         }
//         @keyframes shimmer {
//           0% { transform: translate(-30%, -30%); }
//           100% { transform: translate(30%, 30%); }
//         }
//         .material-symbols-outlined {
//           font-family: 'Material Symbols Outlined';
//           font-weight: normal;
//           font-style: normal;
//           font-size: 24px;
//           line-height: 1;
//           letter-spacing: normal;
//           text-transform: none;
//           display: inline-block;
//           white-space: nowrap;
//           word-wrap: normal;
//           direction: ltr;
//         }
//       `}</style>
//     </div>
//   );
// };  
import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { X, Menu } from 'lucide-react';
import Footer from './Footer';

interface FormData {
  businessName: string;
  businessType: string;
  ownerName: string;
  phone: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  numberOfBranches: string;
  additionalInfo: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ MATERIAL ICONS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MaterialIcon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
  >
    {name}
  </span>
);

// ═══════════════════════════════════════════════════════════════════════════
// ✅ MEMOIZED INPUT FIELD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const InputField = memo(({ 
  label, 
  type = 'text',
  value, 
  onChange, 
  placeholder, 
  error, 
  checkMessage,
  checking,
  exists,
  required = false,
  maxLength,
  options,
  description
}: any) => {
  const isSelect = type === 'select';
  
  return (
    <div className="space-y-2 flex flex-col justify-start">
      <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
        {label} {required && '*'}
      </label>
      
      {/* Description moved below the input to keep input boxes aligned */}
      
      <div className="relative">
        {isSelect ? (
          <select
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-surface rounded-xl border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all outline-none text-body-md appearance-none cursor-pointer"
            required={required}
          >
            {options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`
              w-full px-4 py-3 rounded-xl border-none ring-1 transition-all outline-none text-body-md
              ${error 
                ? 'ring-2 ring-red-500 bg-red-50' 
                : exists
                ? 'ring-2 ring-red-500 bg-red-50'
                : checking
                ? 'ring-2 ring-blue-500 bg-blue-50 animate-pulse'
                : checkMessage && !error
                ? 'ring-2 ring-green-500 bg-green-50'
                : 'ring-outline-variant focus:ring-2 focus:ring-primary bg-surface'
              }
            `}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
          />
        )}
        
        {!isSelect && (checking || checkMessage) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checking && (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            {!checking && checkMessage && !exists && !error && (
              <MaterialIcon name="check_circle" filled className="text-green-600 text-2xl" />
            )}
            {!checking && exists && (
              <MaterialIcon name="cancel" filled className="text-red-600 text-2xl" />
            )}
          </div>
        )}
      </div>

      {/* Helper text / Description rendered here */}
      {description && !error && (
        <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>
      )}
      
      {error && (
        <p className="text-red-600 text-sm font-medium flex items-start gap-1.5 mt-1">
          <MaterialIcon name="error" className="text-lg" />
          <span>{error}</span>
        </p>
      )}
      
      {checkMessage && !error && (
        <p className={`text-sm font-medium mt-1 ${checking ? 'text-blue-700' : exists ? 'text-red-700' : 'text-green-700'}`}>
          {checkMessage}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

// ═══════════════════════════════════════════════════════════════════════════
// ✅ MAIN SELLER REQUEST FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const SellerRequestForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('sellerRequestDraft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          businessName: '',
          businessType: 'Tile Showroom',
          ownerName: '',
          phone: '',
          businessAddress: '',
          city: '',
          state: '',
          pincode: '',
          email: '',
          numberOfBranches: '1',
          additionalInfo: ''
        };
      }
    }
    return {
      businessName: '',
      businessType: 'Tile Showroom',
      ownerName: '',
      phone: '',
      businessAddress: '',
      city: '',
      state: '',
      pincode: '',
      email: '',
      numberOfBranches: '1',
      additionalInfo: ''
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [domainSuggestion, setDomainSuggestion] = useState('');

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

  const [checkingBusinessName, setCheckingBusinessName] = useState(false);
  const [businessNameExists, setBusinessNameExists] = useState(false);
  const [businessNameCheckMessage, setBusinessNameCheckMessage] = useState('');
  
  const lastCheckedEmail = useRef('');
  const lastCheckedPhone = useRef('');
  const lastCheckedBusinessName = useRef('');
  const checkInProgress = useRef(false);
  const lastSubmitTime = useRef(0);
  const SUBMIT_COOLDOWN = 5000;

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ VALIDATION FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return false;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    if (parts[0].length === 0 || parts[1].length === 0) return false;
    if (!parts[1].includes('.')) return false;
    return true;
  };

  const validateEmailDomain = (email: string): { isValid: boolean; suggestion?: string; hasTypo: boolean } => {
    const commonTypos: Record<string, string> = {
      'gmali.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
      'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmial.com': 'gmail.com',
      'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com'
    };
    
    const parts = email.split('@');
    if (parts.length !== 2) return { isValid: false, hasTypo: false };
    
    const domain = parts[1]?.toLowerCase();
    if (!domain) return { isValid: false, hasTypo: false };
    
    if (commonTypos[domain]) {
      return { isValid: false, suggestion: parts[0] + '@' + commonTypos[domain], hasTypo: true };
    }
    
    return { isValid: true, hasTypo: false };
  };

  const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned) return { isValid: false, error: 'Phone number required' };
    if (cleaned.length !== 10) return { isValid: false, error: 'Must be exactly 10 digits' };
    if (!/^[6-9]/.test(cleaned)) return { isValid: false, error: 'Must start with 6, 7, 8, or 9' };
    return { isValid: true };
  };

  const validatePincode = (pincode: string): { isValid: boolean; error?: string } => {
    const cleaned = pincode.replace(/\D/g, '');
    if (!cleaned) return { isValid: false, error: 'Pincode required' };
    if (cleaned.length !== 6) return { isValid: false, error: 'Must be 6 digits' };
    return { isValid: true };
  };

  const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) return { isValid: false, error: 'Owner name required' };
    if (name.trim().length < 2) return { isValid: false, error: 'At least 2 characters required' };
    if (/\d/.test(name)) return { isValid: false, error: 'Cannot contain numbers' };
    if (!/^[a-zA-Z\s]+$/.test(name)) return { isValid: false, error: 'Only letters and spaces allowed' };
    return { isValid: true };
  };

  const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) return { isValid: false, error: 'Business name required' };
    if (name.trim().length < 3) return { isValid: false, error: 'At least 3 characters required' };
    if (name.trim().length > 100) return { isValid: false, error: 'Maximum 100 characters allowed' };
    return { isValid: true };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ DATABASE CHECK FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (checkInProgress.current || !email || !validateEmail(email)) return false;

    const domainCheck = validateEmailDomain(email);
    if (domainCheck.hasTypo && domainCheck.suggestion) {
      setDomainSuggestion(domainCheck.suggestion);
      setEmailError(`Invalid domain. Did you mean: ${domainCheck.suggestion}?`);
      setEmailExists(false);
      setEmailCheckMessage('❌ Invalid domain');
      return false;
    } else {
      setDomainSuggestion('');
    }

    checkInProgress.current = true;
    setCheckingEmail(true);
    setEmailCheckMessage('🔍 Checking...');

    try {
      const emailToCheck = email.toLowerCase().trim();

      const sellersQuery = query(collection(db, 'sellers'), where('email', '==', emailToCheck));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      if (sellersSnapshot.size > 0) {
        setEmailExists(true);
        setEmailCheckMessage('❌ Already registered');
        setEmailError('Email already registered');
        setCheckingEmail(false);
        checkInProgress.current = false;
        lastCheckedEmail.current = emailToCheck;
        return true;
      }

      const requestsQuery = query(collection(db, 'sellerRequests'), where('email', '==', emailToCheck));
      const requestsSnapshot = await getDocs(requestsQuery);
      
      if (requestsSnapshot.size > 0) {
        const status = requestsSnapshot.docs[0].data().status;
        if (status === 'pending') {
          setEmailExists(true);
          setEmailCheckMessage('⏳ Request pending');
          setEmailError('Request already pending');
        } else if (status === 'approved') {
          setEmailExists(true);
          setEmailCheckMessage('✅ Already approved');
          setEmailError('Account already exists');
        } else {
          setEmailExists(false);
          setEmailCheckMessage('⚠️ Can reapply');
          setEmailError('');
        }
        setCheckingEmail(false);
        checkInProgress.current = false;
        lastCheckedEmail.current = emailToCheck;
        return status === 'pending' || status === 'approved';
      }

      setEmailExists(false);
      setEmailCheckMessage('✅ Available');
      setEmailError('');
      setCheckingEmail(false);
      checkInProgress.current = false;
      lastCheckedEmail.current = emailToCheck;
      return false;

    } catch (error) {
      console.error('Email check error:', error);
      setEmailCheckMessage('⚠️ Check failed');
      setEmailExists(false);
      setCheckingEmail(false);
      checkInProgress.current = false;
      return false;
    }
  };

  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length !== 10) return false;
    if (lastCheckedPhone.current === cleaned) return phoneExists;

    setCheckingPhone(true);
    setPhoneCheckMessage('🔍 Checking...');

    try {
      const sellersQuery = query(collection(db, 'sellers'), where('phone', '==', cleaned));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      if (sellersSnapshot.size > 0) {
        setPhoneExists(true);
        setPhoneCheckMessage('❌ Already registered');
        setPhoneError('Phone already in use');
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
      console.error('Phone check error:', error);
      setPhoneCheckMessage('');
      setPhoneExists(false);
      setCheckingPhone(false);
      return false;
    }
  };

  const checkBusinessNameExists = async (name: string): Promise<boolean> => {
    const normalized = name.toLowerCase().trim();
    if (!normalized || normalized.length < 3) return false;
    if (lastCheckedBusinessName.current === normalized) return businessNameExists;

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
      console.error('Business name check error:', error);
      setBusinessNameCheckMessage('');
      setBusinessNameExists(false);
      setCheckingBusinessName(false);
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ DEBOUNCED CHECKS
  // ═══════════════════════════════════════════════════════════════════════════

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
      if (!formData.email.includes('@')) setEmailError('Email must contain @');
      return;
    }

    if (lastCheckedEmail.current === formData.email.toLowerCase().trim()) return;

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

    if (lastCheckedPhone.current === cleaned) return;

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

    if (lastCheckedBusinessName.current === normalized) return;

    const timer = setTimeout(() => {
      checkBusinessNameExists(formData.businessName);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.businessName]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ LOCAL STORAGE SAVE
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!submitted) {
      const timer = setTimeout(() => {
        localStorage.setItem('sellerRequestDraft', JSON.stringify(formData));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData, submitted]);

  useEffect(() => {
    if (submitted) {
      localStorage.removeItem('sellerRequestDraft');
    }
  }, [submitted]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ INPUT CHANGE HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

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
        if (!validation.isValid) setPhoneError(validation.error || 'Invalid');
      }
    }
    
    if (field === 'businessName') {
      setBusinessNameCheckMessage('');
      setBusinessNameExists(false);
      lastCheckedBusinessName.current = '';
      if (businessNameError) setBusinessNameError('');
      if (value) {
        const validation = validateBusinessName(value);
        if (!validation.isValid) setBusinessNameError(validation.error || 'Invalid');
      }
    }
    
    if (field === 'ownerName') {
      if (nameError) setNameError('');
      if (value) {
        const validation = validateOwnerName(value);
        if (!validation.isValid) setNameError(validation.error || 'Invalid');
      }
    }

    if (field === 'pincode') {
      if (pincodeError) setPincodeError('');
      if (value) {
        const validation = validatePincode(value);
        if (!validation.isValid) setPincodeError(validation.error || 'Invalid');
      }
    }
  };

  const useSuggestedEmail = () => {
    if (domainSuggestion) {
      setFormData(prev => ({ ...prev, email: domainSuggestion }));
      setDomainSuggestion('');
      setEmailError('');
      setEmailCheckMessage('');
      lastCheckedEmail.current = '';
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ FORM VALIDATION
  // ═══════════════════════════════════════════════════════════════════════════

  const validateForm = (): boolean => {
    const businessValidation = validateBusinessName(formData.businessName);
    if (!businessValidation.isValid) {
      setBusinessNameError(businessValidation.error || 'Invalid');
      setError('Please fix business name');
      return false;
    }
    
    const nameValidation = validateOwnerName(formData.ownerName);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Invalid');
      setError('Please fix owner name');
      return false;
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError('Enter a valid email address');
      setError('Email is required and must be valid');
      return false;
    }

    const domainCheck = validateEmailDomain(formData.email);
    if (domainCheck.hasTypo) {
      setEmailError(`Invalid domain. Use: ${domainCheck.suggestion}`);
      setError(`Email typo detected!`);
      setDomainSuggestion(domainCheck.suggestion || '');
      return false;
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Invalid');
      setError('Please fix phone number');
      return false;
    }

    const pincodeValidation = validatePincode(formData.pincode);
    if (!pincodeValidation.isValid) {
      setPincodeError(pincodeValidation.error || 'Invalid');
      setError('Please fix pincode');
      return false;
    }
    
    if (!formData.businessAddress.trim()) {
      setError('Business address required');
      return false;
    }

    if (!formData.city.trim()) {
      setError('City required');
      return false;
    }

    if (!formData.state.trim()) {
      setError('State required');
      return false;
    }
    
    return true;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ FORM SUBMIT
  // ═══════════════════════════════════════════════════════════════════════════

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN) {
      const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime.current)) / 1000);
      alert(`⏳ Please wait ${remaining} seconds before submitting again.`);
      return;
    }

    if (checkingEmail || checkingPhone || checkInProgress.current) {
      alert('⏳ Please wait! Email/Phone verification in progress.');
      return;
    }

    if (domainSuggestion) {
      alert(`❌ Invalid Email Domain!\n\nPlease use: ${domainSuggestion}`);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setError('Final verification...');

    try {
      const emailIsRegistered = await checkEmailExists(formData.email);
      if (emailIsRegistered) {
        setError('❌ Email already registered');
        alert('❌ Email Already Registered!');
        setSubmitting(false);
        return;
      }

      const phoneIsRegistered = await checkPhoneExists(formData.phone);
      if (phoneIsRegistered) {
        setError('❌ Phone already registered');
        alert('❌ Phone Already Registered!');
        setSubmitting(false);
        return;
      }

      setError('');
    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Try again.');
      setSubmitting(false);
      return;
    }

    if (emailExists || phoneExists) {
      alert('❌ Cannot Submit! Duplicate data found.');
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'sellerRequests'), {
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        ownerName: formData.ownerName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        businessAddress: formData.businessAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.replace(/\D/g, ''),
        numberOfBranches: formData.numberOfBranches,
        additionalInfo: formData.additionalInfo.trim() || null,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        adminNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        emailDeliveryStatus: null,
        accountCreated: false
      });

      lastSubmitTime.current = Date.now();
      setSubmitted(true);
      
    } catch (err: any) {
      console.error('Firestore error:', err);
      if (err.code === 'permission-denied') {
        setError('❌ Permission denied. Contact support.');
      } else {
        setError('❌ Submission failed. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════════════════════════

  if (submitted) {
    return (
      <div className="landing-zoom-wrapper">
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border-2 border-green-400">
            <div className="mb-6">
              <MaterialIcon name="check_circle" filled className="text-green-600 text-8xl mx-auto animate-bounce" />
            </div>
            
            <h3 className="text-4xl font-bold text-green-800 mb-4">
              ✅ Request Submitted Successfully!
            </h3>
            
            <p className="text-xl text-green-700 mb-8">
              Thank you <strong>{formData.ownerName}</strong>!
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-left border-2 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-5 text-xl flex items-center gap-3">
                <MaterialIcon name="info" filled className="text-blue-600 text-3xl" />
                What's Next?
              </h4>
              
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <MaterialIcon name="schedule" filled className="text-green-600 text-2xl flex-shrink-0" />
                  <span>Review in <strong>2-3 business days</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <MaterialIcon name="mail" filled className="text-green-600 text-2xl flex-shrink-0" />
                  <span className="break-all">Updates to: <strong>{formData.email}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <MaterialIcon name="verified" filled className="text-green-600 text-2xl flex-shrink-0" />
                  <span>Login credentials if <strong>approved</strong></span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 bg-gray-100 rounded-xl p-5 inline-block">
              <p className="text-sm text-gray-600 mb-2">Reference ID</p>
              <p className="text-2xl font-mono font-bold text-gray-900">
                REQ-{Date.now().toString().slice(-8)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ MAIN FORM UI
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="landing-zoom-wrapper">
      <div className="min-h-screen bg-background">
        
        {/* ✅ NAVIGATION BAR - CLEAN & RESPONSIVE */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="w-full max-w-[1800px] mx-auto px-4 md:px-5 py-4 lg:py-6 flex items-center justify-between relative">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
                <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
              </div>
              <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
                Tilesview360
              </span>
            </div>

            {/* Right Action - Back to Home (Visible on ALL devices) */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="bg-[#0040DF] text-white text-[14px] sm:text-[16px] xl:text-[18px] px-5 sm:px-6 xl:px-7 py-2.5 sm:py-3 xl:py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Back to Home
              </button>
            </div>

          </div>
        </nav>

        <main className="pt-20">
          
          {/* ✅ HERO SECTION */}
          <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10"></div>
              <div 
                className="w-full h-full bg-cover bg-center opacity-30" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAroFBavzMYbVtTnj6guHgLgiyRbS4brV2u8LcZRQIewhnEoEWX-C1xnGPMUyOGA_zhWpDcCV_c4lZtco2thvCgItp-fZZOncdfueG4x-CyWT6kd0vIAU6sUE5-hLla2x2-te7Ohikf83acy5pr4_sQRWLe-4_Acr5geqgmLQTrKNEqahOlu4vVSxq-6flte9fsSJ0xBvmnduC6LSX1L8trOUIFTYv46Oyx080w0vIn9uu-7WBvva6OQMA0RI-Ez8-Qv7ebcagl4WKg')" }}
              />
            </div>
            
            <div className="container mx-auto px-3 md:px-5 max-w-[1800px] relative z-20 py-16 md:py-20 lg:py-24">
              <div className="max-w-4xl">
                <h1 className="text-[44px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface mb-8 lg:mb-10">
                  Transform Your Tile Showroom Into a <span className="text-primary">Smart Experience</span>
                </h1>
                
                <p className="text-[17px] md:text-[19px] lg:text-[21px] text-on-surface-variant mb-12 lg:mb-16 leading-relaxed max-w-2xl">
                  Help customers visualize every tile before they buy, increase confidence, and close more sales with AI-powered 3D visualization.
                </p>
                
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
                    <MaterialIcon name="store" filled className="text-primary text-2xl" />
                    <span className="text-[14px] md:text-[15px] font-bold uppercase">Trusted by Dealers</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
                    <MaterialIcon name="view_in_ar" filled className="text-secondary text-2xl" />
                    <span className="text-[14px] md:text-[15px] font-bold uppercase">Realistic 3D Preview</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:scale-105 transition-transform duration-300">
                    <MaterialIcon name="qr_code_2" filled className="text-primary text-2xl" />
                    <span className="text-[14px] md:text-[15px] font-bold uppercase">QR Powered Catalog</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ FORM & FEATURES SECTION */}
          <section className="py-24 bg-surface-container-lowest">
            <div className="container mx-auto px-3 md:px-5 max-w-[1800px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 xl:gap-32 items-start">
                
                {/* LEFT: FORM */}
                <div className="lg:col-span-7">
                  <div className="glass-card p-10 md:p-14 rounded-3xl shadow-xl">
                    <div className="mb-12 p-6 bg-primary/10 border-l-4 border-primary rounded-lg">
                      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
                        Become a <span className="text-primary">Tilesview360 Partner</span>
                      </h2>
                    </div>

                    {error && (
                      <div className="mb-8 p-5 bg-red-50 border-2 border-red-400 rounded-xl flex items-start gap-4">
                        <MaterialIcon name="error" className="text-red-600 text-3xl flex-shrink-0" />
                        <span className="text-red-900 font-semibold text-lg">{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Business Name & Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField
                          label="Business Name"
                          value={formData.businessName}
                          onChange={(e: any) => handleInputChange('businessName', e.target.value)}
                          placeholder="Enter your business name"
                          error={businessNameError}
                          checkMessage={businessNameCheckMessage}
                          checking={checkingBusinessName}
                          exists={businessNameExists}
                          required
                        />
                        <InputField
                          label="Business Type"
                          type="select"
                          value={formData.businessType}
                          onChange={(e: any) => handleInputChange('businessType', e.target.value)}
                          options={['Tile Showroom', 'Tile Distributor', 'Tile Manufacturer', 'Builder', 'Interior Studio']}
                        />
                      </div>

                      {/* Owner Name & Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField
                          label="Owner Name"
                          value={formData.ownerName}
                          onChange={(e: any) => handleInputChange('ownerName', e.target.value)}
                          placeholder="Full name of owner"
                          error={nameError}
                          required
                        />
                        <InputField
                          label="Contact Number"
                          type="tel"
                          value={formData.phone}
                          onChange={(e: any) => handleInputChange('phone', e.target.value)}
                          placeholder="9876543210"
                          error={phoneError}
                          checkMessage={phoneCheckMessage}
                          checking={checkingPhone}
                          exists={phoneExists}
                          maxLength={10}
                          required
                        />
                      </div>

                      {/* Business Address */}
                      <InputField
                        label="Business Address"
                        value={formData.businessAddress}
                        onChange={(e: any) => handleInputChange('businessAddress', e.target.value)}
                        placeholder="Showroom street address"
                        required
                      />

                      {/* City, State, Pincode */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputField
                          label="City"
                          value={formData.city}
                          onChange={(e: any) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          required
                        />
                        <InputField
                          label="State"
                          value={formData.state}
                          onChange={(e: any) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                          required
                        />
                        <InputField
                          label="Pincode"
                          value={formData.pincode}
                          onChange={(e: any) => handleInputChange('pincode', e.target.value)}
                          placeholder="123456"
                          error={pincodeError}
                          maxLength={6}
                          required
                        />
                      </div>

                      {/* Email & Branches */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <InputField
                          label="Business Email"
                          type="email"
                          value={formData.email}
                          onChange={(e: any) => handleInputChange('email', e.target.value)}
                          placeholder="contact@business.com"
                          error={emailError}
                          checkMessage={emailCheckMessage}
                          checking={checkingEmail}
                          exists={emailExists}
                          required
                          description="Must be valid (e.g., name@gmail.com)"
                        />
                        <InputField
                          label="Number of Branches"
                          type="select"
                          value={formData.numberOfBranches}
                          onChange={(e: any) => handleInputChange('numberOfBranches', e.target.value)}
                          options={['1', '2–5', '5+']}
                        />
                      </div>

                      {/* Domain Suggestion */}
                      {domainSuggestion && (
                        <div className="p-6 rounded-xl bg-red-50 border-2 border-red-400">
                          <p className="text-red-900 font-bold mb-3 text-xl">❌ Invalid Email Domain!</p>
                          <p className="text-red-800 text-base mb-4">
                            You typed: <strong className="text-lg">{formData.email}</strong><br />
                            Did you mean: <strong className="text-green-700 text-lg">{domainSuggestion}</strong>?
                          </p>
                          <button
                            type="button"
                            onClick={useSuggestedEmail}
                            className="w-full bg-green-600 text-white px-5 py-4 rounded-lg hover:bg-green-700 font-bold text-lg"
                          >
                            ✅ Use {domainSuggestion}
                          </button>
                        </div>
                      )}

                      {/* Submit Button */}
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
                          !!domainSuggestion
                        }
                        className="w-full py-5 bg-primary text-white font-bold rounded-2xl text-xl shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all ai-shimmer relative overflow-hidden"
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : checkingEmail || checkingPhone ? (
                          'Verifying...'
                        ) : (
                          'Start My Partnership'
                        )}
                      </button>
                    </form>

                    {/* Benefits */}
                    <div className="mt-14 pt-10 border-t border-outline-variant/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {['Free onboarding', 'Secure business info', 'Setup assistance', 'No tech expertise'].map((benefit) => (
                          <div key={benefit} className="flex items-center gap-3 text-on-surface-variant">
                            <MaterialIcon name="check_circle" filled className="text-primary text-3xl" />
                            <span className="text-base font-bold uppercase">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: FEATURES (Added lg:pt-14 here for proper alignment) */}
                <div className="lg:col-span-5 space-y-10 lg:pt-14">
                  <h3 className="text-3xl md:text-4xl font-bold text-on-surface">Why Join Tilesview360?</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* Feature 1 - Increase Sales */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="trending_up" className="text-primary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Increase Sales</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Customers can preview tiles in high-fidelity environments before purchasing, reducing decision fatigue.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2 - Realistic 3D Visualization */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="architecture" className="text-secondary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Realistic 3D Visualization</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Real-time rendering of Kitchen, Bathroom, and Living Room scenes with your exact inventory.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3 - Digital Tile Catalog */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="menu_book" className="text-tertiary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Digital Tile Catalog</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Let workers scan any tile QR in your showroom to visualize it instantly on the device.
                        </p>
                      </div>
                    </div>

                    {/* Feature 4 - Business Insights */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="analytics" className="text-primary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Business Insights</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Track customer preferences and showroom activity with comprehensive AI-driven analytics dashboards.
                        </p>
                      </div>
                    </div>

                    {/* Feature 5 - Cloud Backup */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="cloud_done" className="text-secondary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Cloud Backup</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Securely access your inventory and customer designs across all showroom tablets and devices.
                        </p>
                      </div>
                    </div>

                    {/* Feature 6 - Dedicated Support */}
                    <div className="group flex gap-5 p-6 rounded-2xl hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30">
                      <div className="flex-shrink-0 w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MaterialIcon name="support_agent" className="text-tertiary text-3xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-2 text-xl">Dedicated Support</h4>
                        <p className="text-base text-on-surface-variant leading-relaxed">
                          Direct access to technical training and onboarding for your sales team to maximize ROI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ CTA SECTION */}
          <section className="py-32 md:py-44 relative overflow-hidden bg-surface-dim">
            <div className="absolute inset-0 z-0">
              <div 
                className="w-full h-full bg-cover bg-center backdrop-blur-xl bg-inverse-surface/40"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqUmLy8G6Mkpr2MHBnmreJXZpIMZ6-ybcvNsoccP5n0X_tgXcFXnC4Y4Bp1QU4Mpg5uONRga0Lmz1r_KOf2vFV_wXv5rBa2zYecsgNZQbTGun8yn06lGUTbQdpkZ5zDNGFsyxNqTqmxOlMD-I9S4AqMJyHdoknU6KmqaWRRipqSEL0UfQNEVe6R9nctBZQaYjO7swESY2NX5MkXgBeEFUD2g8GfETA5KeYL--6GrCDW5GEz0GGVWJ0Wwgp366-h0CQmHRKTrGD4Lfs')" }}
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent"></div>
            </div>
            
            <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white max-w-[1600px]">
              
              <h2 className="text-base md:text-lg lg:text-[22px] font-medium w-full mx-auto leading-relaxed md:leading-snug tracking-wide">
                
                <span className="block lg:inline-block">
                  Join hundreds of forward-thinking tile businesses using AI-powered 3D visualization to help customers choose
                </span>
                
                <span className="block mt-1 md:mt-1.5 text-white/90">
                  with confidence and increase showroom conversions.
                </span>
                
              </h2>
            </div>
          </section>
        </main>

        <Footer/>

        {/* ✅ STYLES */}
        <style>{`
          .glass-card {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.6);
          }
          .ai-shimmer {
            position: relative;
            overflow: hidden;
          }
          .ai-shimmer::after {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%);
            animation: shimmer 4s infinite linear;
          }
          @keyframes shimmer {
            0% { transform: translate(-30%, -30%); }
            100% { transform: translate(30%, 30%); }
          }
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
          }
        `}</style>
      </div>
    </div>
  );
};