
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader,
  Building,
} from "lucide-react";
import { saveCustomerToSession } from '../utils/customerSession';

interface CustomerInquiryFormProps {
  tileId: string;
  tileName: string;
  tileCode?: string;
  tileImageUrl?: string;
  tileSize?: string;
  tilePrice?: number;
  workerId: string;
  workerEmail: string;
  sellerId: string;
  sellerBusinessName: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CustomerInquiryForm: React.FC<CustomerInquiryFormProps> = ({
  tileId,
  tileName,
  tileCode,
  tileImageUrl,
  tileSize,
  tilePrice,
  workerId,
  workerEmail,
  sellerId,
  sellerBusinessName,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Auto-focus first input
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = document.getElementById("customer_name");
      if (firstInput && !isMobile) {
        firstInput.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Prevent body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSubmitting]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  // ✅ FIXED - Email & Address completely optional
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "customer_name":
        if (!value.trim()) return "Customer name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return null;

      case "customer_phone":
        if (!value.trim()) return "Phone number is required";
        if (!validatePhone(value)) return "Phone number must be exactly 10 digits";
        return null;

      case "customer_email":
        // ✅ ONLY validate format IF something is entered
        if (value.trim() && !validateEmail(value)) {
          return "Invalid email format";
        }
        return null; // ✅ Empty is perfectly valid

      case "customer_address":
        // ✅ ONLY validate length IF something is entered
        if (value.trim() && value.trim().length < 10) {
          return "Please enter complete address (min 10 characters)";
        }
        return null; // ✅ Empty is perfectly valid

      default:
        return null;
    }
  };

  // ✅ FIXED - Only validate REQUIRED fields (name & phone)
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // ✅ Only check required fields
    const nameError = validateField("customer_name", formData.customer_name);
    if (nameError) newErrors.customer_name = nameError;

    const phoneError = validateField("customer_phone", formData.customer_phone);
    if (phoneError) newErrors.customer_phone = phoneError;

    // ✅ Check optional fields ONLY if they have content
    if (formData.customer_email.trim()) {
      const emailError = validateField("customer_email", formData.customer_email);
      if (emailError) newErrors.customer_email = emailError;
    }

    if (formData.customer_address.trim()) {
      const addressError = validateField("customer_address", formData.customer_address);
      if (addressError) newErrors.customer_address = addressError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation only if field is touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      // ✅ Clear error if field becomes valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // ✅ Only mark REQUIRED fields as touched
    setTouched({
      customer_name: true,
      customer_phone: true,
    });

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const deviceType =
        window.innerWidth < 768
          ? "mobile"
          : window.innerWidth < 1024
          ? "tablet"
          : "desktop";

      const inquiryData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || null, // ✅ null if empty
        customer_address: formData.customer_address.trim() || null, // ✅ null if empty
        tile_id: tileId,
        tile_name: tileName,
        tile_code: tileCode || null,
        tile_image_url: tileImageUrl || null,
        tile_size: tileSize || null,
        tile_price: tilePrice || null,
        scanned_by: workerId,
        worker_email: workerEmail,
        seller_id: sellerId,
        seller_business_name: sellerBusinessName,
        timestamp: new Date().toISOString(),
        status: "new" as const,
        source: "qr_scan" as const,
        device_type: deviceType,
      };

      await onSubmit(inquiryData);

      console.log('💾 Saving customer to session...');
      
      const sessionSaved = saveCustomerToSession({
        name: formData.customer_name.trim(),
        phone: formData.customer_phone.trim(),
        email: formData.customer_email.trim() || undefined,
        address: formData.customer_address.trim() || undefined,
        tileId: tileId,
        workerId: workerId
      });
      
      if (sessionSaved) {
        console.log('✅ Customer saved to session');
      }
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      setSubmitError(
        error.message || "Failed to save customer details. Please try again."
      );
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;

    const hasData = Object.values(formData).some((v) => v.trim() !== "");

    if (hasData) {
      const confirmed = window.confirm(
        "Customer details will not be saved.\n\nAre you sure you want to cancel?"
      );
      if (!confirmed) return;
    }

    onCancel();
  };

  // ✅ Form is valid if name (2+ chars) and phone (10 digits) are valid
  const isFormValid = 
    formData.customer_name.trim().length >= 2 &&
    validatePhone(formData.customer_phone) &&
    // ✅ Email must be valid IF entered
    (!formData.customer_email.trim() || validateEmail(formData.customer_email)) &&
    // ✅ Address must be 10+ chars IF entered
    (!formData.customer_address.trim() || formData.customer_address.trim().length >= 10);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={(e) =>
        e.target === e.currentTarget && !isSubmitting && handleCancel()
      }
    >
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-2xl shadow-2xl sm:max-w-2xl sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white flex-shrink-0 safe-top">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 truncate">
                Customer Details
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-blue-100 text-xs sm:text-sm">
                <span className="truncate">{tileName}</span>
                {tileCode && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-mono bg-white/20 px-2 py-0.5 rounded">
                      {tileCode}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 flex-shrink-0 touch-manipulation"
              aria-label="Close form"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Error Alert */}
          {submitError && (
            <div className="m-4 sm:m-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-red-800 font-medium text-sm">Submission Failed</p>
                <p className="text-red-700 text-xs sm:text-sm break-words mt-1">
                  {submitError}
                </p>
              </div>
              <button
                onClick={() => setSubmitError(null)}
                className="text-red-400 hover:text-red-600 p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Tile Preview */}
            {tileImageUrl && (
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={tileImageUrl}
                    alt={tileName}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-blue-500/30 shadow-md flex-shrink-0"
                    loading="eager"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                      {tileName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tileSize && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {tileSize}
                        </span>
                      )}
                      {tilePrice && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          ₹{tilePrice}/sq.ft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mt-1 truncate">
                      Worker: {workerEmail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-5">
              {/* ✅ Customer Name - REQUIRED */}
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="customer_name"
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange("customer_name", e.target.value)}
                    onBlur={() => handleBlur("customer_name")}
                    disabled={isSubmitting}
                    placeholder="Enter full name"
                    className={`
                      w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-sm sm:text-base transition-all touch-manipulation
                      ${errors.customer_name && touched.customer_name ? "border-red-500" : "border-gray-300"}
                    `}
                    autoComplete="name"
                    inputMode="text"
                  />
                </div>
                {errors.customer_name && touched.customer_name && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.customer_name}
                  </p>
                )}
              </div>

              {/* ✅ Customer Phone - REQUIRED */}
              <div>
                <label
                  htmlFor="customer_phone"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange("customer_phone", value);
                    }}
                    onBlur={() => handleBlur("customer_phone")}
                    disabled={isSubmitting}
                    placeholder="9876543210 (10 digits)"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]*"
                    className={`
                      w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-sm sm:text-base transition-all touch-manipulation
                      ${errors.customer_phone && touched.customer_phone ? "border-red-500" : "border-gray-300"}
                    `}
                    autoComplete="tel"
                  />
                </div>
                {errors.customer_phone && touched.customer_phone && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.customer_phone}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter 10-digit mobile number
                </p>
              </div>

              {/* ✅ Customer Email - OPTIONAL */}
              <div>
                <label
                  htmlFor="customer_email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange("customer_email", e.target.value)}
                    onBlur={() => handleBlur("customer_email")}
                    disabled={isSubmitting}
                    placeholder="customer@example.com"
                    className={`
                      w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-sm sm:text-base transition-all touch-manipulation
                      ${errors.customer_email && touched.customer_email ? "border-red-500" : "border-gray-300"}
                    `}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                {errors.customer_email && touched.customer_email && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.customer_email}
                  </p>
                )}
              </div>

              {/* ✅ Customer Address - OPTIONAL */}
              <div>
                <label
                  htmlFor="customer_address"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Complete Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    id="customer_address"
                    value={formData.customer_address}
                    onChange={(e) => handleInputChange("customer_address", e.target.value)}
                    onBlur={() => handleBlur("customer_address")}
                    disabled={isSubmitting}
                    placeholder="Street, area, city, state, pincode"
                    rows={isMobile ? 3 : 4}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-sm sm:text-base resize-none transition-all touch-manipulation
                      ${errors.customer_address && touched.customer_address ? "border-red-500" : "border-gray-300"}
                    `}
                    autoComplete="street-address"
                  />
                </div>
                {errors.customer_address && touched.customer_address && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.customer_address}
                  </p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-blue-900 font-medium text-xs sm:text-sm">
                    ✅ Details will be saved to {sellerBusinessName}'s dashboard
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    Only Name & Phone required • Email & Address are optional
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 bg-gray-50 border-t border-gray-200 safe-bottom">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const form = document.querySelector("form");
                if (form) {
                  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                }
              }}
              disabled={isSubmitting || !isFormValid}
              className="
                flex-1 flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                py-3 sm:py-3.5 px-6 rounded-lg sm:rounded-xl
                font-semibold hover:from-blue-700 hover:to-purple-700 
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all text-sm sm:text-base
                shadow-lg hover:shadow-xl
                touch-manipulation min-h-[48px]
              "
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save & View Tile
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="
                flex-1 sm:flex-none flex items-center justify-center gap-2
                border-2 border-gray-300 text-gray-700 
                py-3 sm:py-3.5 px-6 rounded-lg sm:rounded-xl
                font-semibold hover:bg-gray-100 active:bg-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all text-sm sm:text-base
                touch-manipulation min-h-[48px]
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};