 

// src/components/SellerRequestForm.tsx
import React, { useState } from 'react';
import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { validateEmail } from '../lib/firebaseutils'; // ✅ Add this import

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  additionalInfo: string;
}

export const SellerRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessAddress: '',
    additionalInfo: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // ✅ Simple email validation function
  const validateBusinessEmail = (email: string): { isValid: boolean; error?: string } => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!validateEmail(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user types
    if (error) setError('');
    if (field === 'email' && emailError) setEmailError('');
    
    // Real-time email validation
    if (field === 'email' && value) {
      const validation = validateBusinessEmail(value);
      if (!validation.isValid) {
        setEmailError(validation.error || 'Invalid email');
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.ownerName.trim()) {
      setError('Owner name is required');
      return false;
    }
    
    const emailValidation = validateBusinessEmail(formData.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Invalid email');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.businessAddress.trim()) {
      setError('Business address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');

    try {
      console.log('📝 Submitting seller request:', formData);

      // ✅ Add to sellerRequests collection
      const docRef = await addDoc(collection(db, 'sellerRequests'), {
        ...formData,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        adminNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        emailDeliveryStatus: null,
        accountCreated: false
      });

      console.log('✅ Request submitted with ID:', docRef.id);
      setSubmitted(true);
      
    } catch (error: any) {
      console.error('❌ Error submitting request:', error);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Request Submitted Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you <strong>{formData.ownerName}</strong> for your interest in joining our platform.
        </p>
        <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-gray-800 mb-2">📋 What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Our team will review your application</li>
            <li>• Verification process: 2-3 business days</li>
            <li>• You'll receive email updates at: <strong>{formData.email}</strong></li>
            <li>• If approved, you'll get login credentials immediately</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Reference ID: REQ-{Date.now().toString().slice(-6)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Store className="w-10 h-10" />
          <div>
            <h2 className="text-2xl font-bold">Become a Seller Partner</h2>
            <p className="text-blue-100">Join our platform and showcase your tiles to more customers</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Error Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Store className="w-4 h-4 inline mr-1" />
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. ABC Tiles & Ceramics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Owner Name *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Business Email * 
              <span className="text-xs text-gray-500">(Login credentials will be sent here)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="business@yourcompany.com"
              required
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="+91 9876543210"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Business Address *
          </label>
          <textarea
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Complete business address with city, state, pincode"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tell us about your tile business (optional)
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Years in business, specialties, customer base, etc."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !!emailError}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg transition-all transform hover:scale-[1.02]"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting Request...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Seller Request
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-2">✨ Why join our platform?</p>
          <ul className="space-y-1">
            <li>• Reach customers with 3D tile visualization</li>
            <li>• Analytics to track tile performance</li>
            <li>• Easy inventory management</li>
            <li>• QR code integration for physical stores</li>
            <li>• Professional seller dashboard</li>
          </ul>
        </div>
      </form>
    </div>
  );
};


