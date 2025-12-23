// import React, { useState, useEffect, useRef } from 'react';
// import { X, User, Phone, MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react';

// interface CustomerLeadFormProps {
//   tileData: {
//     id: string;
//     name: string;
//     imageUrl: string;
//     price: number;
//     size: string;
//     code?: string;
//   };
//   scannerInfo: {
//     sellerId: string;
//     showroomId: string;
//     scannedBy: 'worker' | 'seller' | 'customer';
//     workerId?: string;
//     workerName?: string;
//     workerEmail?: string;
//   };
//   onSubmit: (formData: {
//     customerName: string;
//     customerPhone: string;
//     customerAddress?: string;
//   }) => Promise<void>;
//   onCancel?: () => void;
// }

// export const CustomerLeadForm: React.FC<CustomerLeadFormProps> = ({
//   tileData,
//   scannerInfo,
//   onSubmit,
//   onCancel
// }) => {
//   // ═══════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═══════════════════════════════════════════════════════════
  
//   const [formData, setFormData] = useState({
//     customerName: '',
//     customerPhone: '',
//     customerAddress: ''
//   });

//   const [errors, setErrors] = useState<{
//     customerName?: string;
//     customerPhone?: string;
//   }>({});

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
  
//   const nameInputRef = useRef<HTMLInputElement>(null);

//   // ═══════════════════════════════════════════════════════════
//   // AUTO-FOCUS ON MOUNT
//   // ═══════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     // Focus on name field after animation
//     setTimeout(() => {
//       nameInputRef.current?.focus();
//     }, 300);

//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   // ═══════════════════════════════════════════════════════════
//   // VALIDATION FUNCTIONS
//   // ═══════════════════════════════════════════════════════════
  
//   const validateName = (name: string): string | undefined => {
//     if (!name.trim()) {
//       return 'कृपया अपना नाम भरें (Name is required)';
//     }
//     if (name.trim().length < 2) {
//       return 'नाम कम से कम 2 अक्षर का होना चाहिए (Min 2 characters)';
//     }
//     if (name.trim().length > 50) {
//       return 'नाम 50 अक्षर से कम होना चाहिए (Max 50 characters)';
//     }
//     return undefined;
//   };

//   const validatePhone = (phone: string): string | undefined => {
//     const cleaned = phone.replace(/\D/g, '');
    
//     if (!cleaned) {
//       return 'फ़ोन नंबर भरना ज़रूरी है (Phone is required)';
//     }
//     if (cleaned.length !== 10) {
//       return '10 अंकों का नंबर डालें (Enter 10 digits)';
//     }
//     if (!/^[6-9]/.test(cleaned)) {
//       return 'नंबर 6-9 से शुरू होना चाहिए (Must start with 6-9)';
//     }
//     return undefined;
//   };

//   // ═══════════════════════════════════════════════════════════
//   // INPUT HANDLERS
//   // ═══════════════════════════════════════════════════════════
  
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, customerName: value }));
    
//     // Clear error when user starts typing
//     if (errors.customerName) {
//       setErrors(prev => ({ ...prev, customerName: undefined }));
//     }
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // Only allow numbers
//     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//     setFormData(prev => ({ ...prev, customerPhone: value }));
    
//     // Clear error when user starts typing
//     if (errors.customerPhone) {
//       setErrors(prev => ({ ...prev, customerPhone: undefined }));
//     }
//   };

//   const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const value = e.target.value.slice(0, 200); // Max 200 chars
//     setFormData(prev => ({ ...prev, customerAddress: value }));
//   };

//   // ═══════════════════════════════════════════════════════════
//   // FORM SUBMISSION
//   // ═══════════════════════════════════════════════════════════
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     console.log('📝 Form submission started...');
    
//     // Clear previous errors
//     setErrors({});
//     setSubmitError(null);

//     // Validate all fields
//     const nameError = validateName(formData.customerName);
//     const phoneError = validatePhone(formData.customerPhone);

//     if (nameError || phoneError) {
//       setErrors({
//         customerName: nameError,
//         customerPhone: phoneError
//       });
      
//       // Scroll to first error
//       if (nameError) {
//         nameInputRef.current?.focus();
//       }
      
//       console.log('❌ Validation failed:', { nameError, phoneError });
//       return;
//     }

//     // All validations passed
//     setIsSubmitting(true);

//     try {
//       console.log('✅ Validation passed, submitting...');
      
//       // Call parent's onSubmit
//       await onSubmit({
//         customerName: formData.customerName.trim(),
//         customerPhone: formData.customerPhone.trim(),
//         customerAddress: formData.customerAddress.trim() || undefined
//       });

//       console.log('✅ Form submitted successfully');
      
//       // Success - parent will handle navigation
      
//     } catch (error: any) {
//       console.error('❌ Form submission error:', error);
//       setSubmitError(error.message || 'Failed to save details. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════
  
//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
//       <div 
//         className="bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ═══════════════════════════════════════════════════ */}
//         {/* HEADER */}
//         {/* ═══════════════════════════════════════════════════ */}
        
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0 safe-top">
//           <div className="flex items-center gap-3 min-w-0 flex-1">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-white font-bold text-base sm:text-lg truncate">
//                 Customer Details
//               </h2>
//               <p className="text-blue-100 text-xs sm:text-sm truncate">
//                 Required before 3D view
//               </p>
//             </div>
//           </div>
          
//           {onCancel && (
//             <button
//               onClick={onCancel}
//               disabled={isSubmitting}
//               className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
//               aria-label="Cancel"
//             >
//               <X className="w-5 h-5 sm:w-6 sm:h-6" />
//             </button>
//           )}
//         </div>

//         {/* ═══════════════════════════════════════════════════ */}
//         {/* TILE INFO BANNER */}
//         {/* ═══════════════════════════════════════════════════ */}
        
//         <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-6 py-3 border-b border-purple-200 flex items-center gap-3 flex-shrink-0">
//           <img
//             src={tileData.imageUrl}
//             alt={tileData.name}
//             className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border-2 border-white shadow-md flex-shrink-0"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//             }}
//           />
//           <div className="min-w-0 flex-1">
//             <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
//               {tileData.name}
//             </p>
//             <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
//               <span>{tileData.size}</span>
//               <span>•</span>
//               <span className="font-semibold text-green-600">₹{tileData.price.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════ */}
//         {/* FORM CONTENT */}
//         {/* ═══════════════════════════════════════════════════ */}
        
//         <div className="flex-1 overflow-y-auto">
//           <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            
//             {/* Info Message */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div className="text-sm text-blue-800">
//                 <p className="font-medium mb-1">Why do we need this?</p>
//                 <p className="text-xs sm:text-sm">
//                   Before viewing in 3D, please share your details so we can assist you better.
//                 </p>
//               </div>
//             </div>

//             {/* Error Message */}
//             {submitError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3 animate-shake">
//                 <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-red-800 font-medium text-sm">Error</p>
//                   <p className="text-red-700 text-xs sm:text-sm">{submitError}</p>
//                 </div>
//                 <button
//                   onClick={() => setSubmitError(null)}
//                   className="text-red-400 hover:text-red-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             {/* Customer Name Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <User className="w-4 h-4 inline mr-1" />
//                 Customer Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 ref={nameInputRef}
//                 type="text"
//                 value={formData.customerName}
//                 onChange={handleNameChange}
//                 placeholder="Enter full name"
//                 disabled={isSubmitting}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
//                   errors.customerName
//                     ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
//                     : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//                 } disabled:bg-gray-100 disabled:cursor-not-allowed`}
//                 autoComplete="name"
//                 autoCapitalize="words"
//               />
//               {errors.customerName && (
//                 <p className="mt-1.5 text-red-600 text-xs sm:text-sm flex items-center gap-1">
//                   <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
//                   {errors.customerName}
//                 </p>
//               )}
//             </div>

//             {/* Phone Number Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <Phone className="w-4 h-4 inline mr-1" />
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//                   +91
//                 </span>
//                 <input
//                   type="tel"
//                   value={formData.customerPhone}
//                   onChange={handlePhoneChange}
//                   placeholder="9876543210"
//                   disabled={isSubmitting}
//                   className={`w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-base font-mono ${
//                     errors.customerPhone
//                       ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
//                       : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//                   } disabled:bg-gray-100 disabled:cursor-not-allowed`}
//                   autoComplete="tel"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   maxLength={10}
//                 />
//               </div>
//               {errors.customerPhone && (
//                 <p className="mt-1.5 text-red-600 text-xs sm:text-sm flex items-center gap-1">
//                   <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
//                   {errors.customerPhone}
//                 </p>
//               )}
//               {formData.customerPhone && !errors.customerPhone && formData.customerPhone.length === 10 && (
//                 <p className="mt-1.5 text-green-600 text-xs sm:text-sm flex items-center gap-1">
//                   <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
//                   Valid phone number
//                 </p>
//               )}
//             </div>

//             {/* Address Field (Optional) */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 inline mr-1" />
//                 Address <span className="text-gray-400 text-xs">(Optional)</span>
//               </label>
//               <textarea
//                 value={formData.customerAddress}
//                 onChange={handleAddressChange}
//                 placeholder="Enter your address (optional)"
//                 disabled={isSubmitting}
//                 rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 resize-none transition-all text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 autoComplete="street-address"
//                 maxLength={200}
//               />
//               <p className="mt-1 text-xs text-gray-500 text-right">
//                 {formData.customerAddress.length}/200 characters
//               </p>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" />
//                   <span>Saving Details...</span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5" />
//                   <span>Submit & View in 3D</span>
//                 </>
//               )}
//             </button>

//             {/* Privacy Note */}
//             <p className="text-xs text-gray-500 text-center">
//               🔒 Your information is secure and will only be used to assist you with tile selection.
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }; 
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, Mail, MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface CustomerLeadFormProps {
  tileData: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    size: string;
    code?: string;
  };
  scannerInfo: {
    sellerId: string;
    showroomId: string;
    scannedBy: 'worker' | 'seller' | 'customer';
    workerId?: string;
    workerName?: string;
    workerEmail?: string;
  };
  onSubmit: (formData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export const CustomerLeadForm: React.FC<CustomerLeadFormProps> = ({
  tileData,
  scannerInfo,
  onSubmit,
  onCancel
}) => {
  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: ''
  });

  const [errors, setErrors] = useState<{
    customerName?: string;
    customerPhone?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ═══════════════════════════════════════════════════════════
  // AUTO-FOCUS ON MOUNT
  // ═══════════════════════════════════════════════════════════
  
  useEffect(() => {
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 300);

    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ═══════════════════════════════════════════════════════════
  // VALIDATION FUNCTIONS
  // ═══════════════════════════════════════════════════════════
  
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'कृपया अपना नाम भरें (Name is required)';
    }
    if (name.trim().length < 2) {
      return 'नाम कम से कम 2 अक्षर का होना चाहिए (Min 2 characters)';
    }
    if (name.trim().length > 50) {
      return 'नाम 50 अक्षर से कम होना चाहिए (Max 50 characters)';
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!cleaned) {
      return 'फ़ोन नंबर भरना ज़रूरी है (Phone is required)';
    }
    if (cleaned.length !== 10) {
      return '10 अंकों का नंबर डालें (Enter 10 digits)';
    }
    if (!/^[6-9]/.test(cleaned)) {
      return 'नंबर 6-9 से शुरू होना चाहिए (Must start with 6-9)';
    }
    return undefined;
  };

  // ═══════════════════════════════════════════════════════════
  // INPUT HANDLERS
  // ═══════════════════════════════════════════════════════════
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, customerName: value }));
    
    if (errors.customerName) {
      setErrors(prev => ({ ...prev, customerName: undefined }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, customerPhone: value }));
    
    if (errors.customerPhone) {
      setErrors(prev => ({ ...prev, customerPhone: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, customerEmail: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 200);
    setFormData(prev => ({ ...prev, customerAddress: value }));
  };

  // ═══════════════════════════════════════════════════════════
  // FORM SUBMISSION
  // ═══════════════════════════════════════════════════════════
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('📝 Form submission started...');
    
    setErrors({});
    setSubmitError(null);

    // ✅ VALIDATE ONLY REQUIRED FIELDS (Name + Phone)
    const nameError = validateName(formData.customerName);
    const phoneError = validatePhone(formData.customerPhone);

    if (nameError || phoneError) {
      setErrors({
        customerName: nameError,
        customerPhone: phoneError
      });
      
      if (nameError) {
        nameInputRef.current?.focus();
      }
      
      console.log('❌ Validation failed:', { nameError, phoneError });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('✅ Validation passed, submitting...');
      
      // ✅ SUBMIT WITH OPTIONAL EMAIL AND ADDRESS
      await onSubmit({
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail?.trim() || undefined,
        customerAddress: formData.customerAddress?.trim() || undefined
      });

      console.log('✅ Form submitted successfully');
      
    } catch (error: any) {
      console.error('❌ Form submission error:', error);
      setSubmitError(error.message || 'Failed to save details. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════ */}
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0 safe-top">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-bold text-base sm:text-lg truncate">
                Customer Details
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm truncate">
                Required before 3D view
              </p>
            </div>
          </div>
          
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
              aria-label="Cancel"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TILE INFO BANNER */}
        {/* ═══════════════════════════════════════════════════ */}
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-6 py-3 border-b border-purple-200 flex items-center gap-3 flex-shrink-0">
          <img
            src={tileData.imageUrl}
            alt={tileData.name}
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border-2 border-white shadow-md flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-tile.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {tileData.name}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>{tileData.size}</span>
              <span>•</span>
              <span className="font-semibold text-green-600">₹{tileData.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* FORM CONTENT */}
        {/* ═══════════════════════════════════════════════════ */}
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            
            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">केवल नाम और फोन अनिवार्य है</p>
                <p className="text-xs sm:text-sm">
                  Only name and phone are required. Email & address are optional.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium text-sm">Error</p>
                  <p className="text-red-700 text-xs sm:text-sm">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Customer Name Field (REQUIRED) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                नाम / Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={formData.customerName}
                onChange={handleNameChange}
                placeholder="पूरा नाम / Full name"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.customerName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                autoComplete="name"
                autoCapitalize="words"
              />
              {errors.customerName && (
                <p className="mt-1.5 text-red-600 text-xs sm:text-sm flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Phone Number Field (REQUIRED) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                फोन नंबर / Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  disabled={isSubmitting}
                  className={`w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-base font-mono ${
                    errors.customerPhone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                />
              </div>
              {errors.customerPhone && (
                <p className="mt-1.5 text-red-600 text-xs sm:text-sm flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.customerPhone}
                </p>
              )}
              {formData.customerPhone && !errors.customerPhone && formData.customerPhone.length === 10 && (
                <p className="mt-1.5 text-green-600 text-xs sm:text-sm flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  सही नंबर / Valid number ✓
                </p>
              )}
            </div>

            {/* Email Field (OPTIONAL) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                ईमेल / Email{' '}
                <span className="text-gray-400 text-xs font-normal">(छोड़ सकते हैं / Optional)</span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={handleEmailChange}
                placeholder="email@example.com (optional)"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 resize-none transition-all text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                autoComplete="email"
                inputMode="email"
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 छोड़ सकते हैं / Can skip - not required
              </p>
            </div>

            {/* Address Field (OPTIONAL) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                पता / Address{' '}
                <span className="text-gray-400 text-xs font-normal">(छोड़ सकते हैं / Optional)</span>
              </label>
              <textarea
                value={formData.customerAddress}
                onChange={handleAddressChange}
                placeholder="पता लिखें (optional) / Enter address (optional)"
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 resize-none transition-all text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                autoComplete="street-address"
                maxLength={200}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  💡 छोड़ सकते हैं / Can skip - not required
                </p>
                <p className="text-xs text-gray-500">
                  {formData.customerAddress.length}/200
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>सेव हो रहा है / Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>सबमिट करें / Submit & View 3D</span>
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center">
              🔒 आपकी जानकारी सुरक्षित है / Your information is secure
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};