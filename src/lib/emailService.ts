
import emailjs from '@emailjs/browser';

// ═══════════════════════════════════════════════════════════════
// ✅ TYPE DEFINITIONS & INTERFACES
// ═══════════════════════════════════════════════════════════════

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  environment: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
  details?: any;
  timestamp?: string;
  retryCount?: number;
}

interface EmailTemplateParams {
  to_email: string;
  to_name: string;
  business_name: string;
  [key: string]: any;
}

interface HealthCheckResult {
  configured: boolean;
  message: string;
  details: {
    serviceId: string;
    templateId: string;
    publicKey: string;
    environment: string;
    timestamp: string;
  };
  warnings: string[];
  recommendations: string[];
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// ✅ CONFIGURATION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export const getEmailServiceConfig = (): EmailConfig => {
  const config = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    environment: import.meta.env.MODE || 'development'
  };

  console.log('📧 Email Config Status:', {
    serviceId: config.serviceId ? '✅ Set' : '❌ Missing',
    templateId: config.templateId ? '✅ Set' : '❌ Missing',
    publicKey: config.publicKey ? '✅ Set' : '❌ Missing',
    environment: config.environment
  });

  return config;
};

// ═══════════════════════════════════════════════════════════════
// ✅ HEALTH CHECK & VALIDATION
// ═══════════════════════════════════════════════════════════════

export const checkEmailServiceHealth = async (): Promise<HealthCheckResult> => {
  try {
    console.log('🔄 Performing comprehensive email service health check...');
    
    const config = getEmailServiceConfig();
    
    const isConfigured = !!(
      config.serviceId && 
      config.templateId && 
      config.publicKey &&
      config.serviceId !== 'your-service-id' &&
      config.templateId !== 'your-template-id' &&
      config.publicKey !== 'your-public-key' &&
      config.serviceId.startsWith('service_') &&
      config.templateId.startsWith('template_')
    );
    
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    const result: HealthCheckResult = {
      configured: isConfigured,
      message: isConfigured 
        ? 'Email service is properly configured and ready for production'
        : 'Email service requires proper configuration. Please check your EmailJS credentials.',
      details: {
        serviceId: config.serviceId ? (config.serviceId.startsWith('service_') ? '✅ Valid' : '⚠️ Invalid Format') : '❌ Missing',
        templateId: config.templateId ? (config.templateId.startsWith('template_') ? '✅ Valid' : '⚠️ Invalid Format') : '❌ Missing',
        publicKey: config.publicKey ? (config.publicKey.length > 10 ? '✅ Valid' : '⚠️ Too Short') : '❌ Missing',
        environment: config.environment,
        timestamp: new Date().toISOString()
      },
      warnings,
      recommendations
    };

    if (!isConfigured) {
      result.warnings.push('Email service not configured - manual credential sharing required');
      result.recommendations.push('Set up EmailJS account and configure environment variables');
    }

    if (config.environment === 'development') {
      result.warnings.push('Running in development mode');
      result.recommendations.push('Verify production EmailJS settings for deployment');
    }
    
    console.log('📧 Email service health check completed:', {
      configured: result.configured,
      warnings: result.warnings.length,
      recommendations: result.recommendations.length
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Email service health check failed:', error);
    return {
      configured: false,
      message: 'Email service health check encountered an error',
      error: error instanceof Error ? error.message : String(error),
      details: {
        serviceId: '❌ Error',
        templateId: '❌ Error',
        publicKey: '❌ Error',
        environment: 'unknown',
        timestamp: new Date().toISOString()
      },
      warnings: ['Health check failed'],
      recommendations: ['Check email service configuration', 'Verify network connectivity']
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ EMAIL SERVICE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

const initializeEmailJS = (retryCount: number = 0): boolean => {
  const maxRetries = 3;
  
  try {
    const config = getEmailServiceConfig();
    
    if (!config.publicKey) {
      console.warn('⚠️ EmailJS public key not configured');
      return false;
    }
    
    if (config.publicKey.length < 10) {
      console.warn('⚠️ EmailJS public key appears invalid (too short)');
      return false;
    }
    
    emailjs.init(config.publicKey);
    console.log('✅ EmailJS initialized successfully', retryCount > 0 ? `(retry ${retryCount})` : '');
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to initialize EmailJS (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying EmailJS initialization in 1 second...`);
      setTimeout(() => initializeEmailJS(retryCount + 1), 1000);
      return false;
    }
    
    console.error('❌ EmailJS initialization failed after all retries');
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const generateSecurePassword = (): string => {
  const length = 12;
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  
  let password = "";
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const validateEmailParams = (params: EmailTemplateParams): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!params.to_email || !params.to_email.trim()) {
    errors.push('Recipient email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.to_email.trim())) {
      errors.push('Invalid email format');
    }
  }
  
  if (!params.to_name || !params.to_name.trim()) {
    errors.push('Recipient name is required');
  }
  
  if (!params.business_name || !params.business_name.trim()) {
    errors.push('Business name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ✅ DEBUGGING FUNCTION
export const debugEmailParameters = (templateParams: any, emailType: string): void => {
  console.log(`\n🔍 ========== EMAIL DEBUG (${emailType}) ==========`);
  console.log('📤 Parameters being sent to EmailJS:');
  console.table(templateParams);
  
  console.log('\n📋 Individual Parameters Check:');
  Object.entries(templateParams).forEach(([key, value]) => {
    const status = value ? '✅' : '❌ EMPTY';
    const displayValue = value ? (typeof value === 'string' && value.length > 50 ? `${String(value).substring(0, 50)}...` : String(value)) : '⚠️ MISSING';
    console.log(`   ${status} ${key}: ${displayValue}`);
  });
  
  console.log('🔍 ============================================\n');
};

// ═══════════════════════════════════════════════════════════════
// ✅ EMAIL SENDING WITH RETRY LOGIC
// ═══════════════════════════════════════════════════════════════

const sendEmailWithRetry = async (
  serviceId: string,
  templateId: string,
  templateParams: EmailTemplateParams,
  maxRetries: number = 3
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Email send attempt ${attempt}/${maxRetries} to:`, templateParams.to_email);
      
      const response = await emailjs.send(serviceId, templateId, templateParams);
      
      console.log(`✅ Email sent successfully on attempt ${attempt}:`, {
        status: response.status,
        recipient: templateParams.to_email,
        type: templateParams.email_type || 'approval'
      });
      
      return response;
      
    } catch (error: any) {
      lastError = error;
      console.warn(`⚠️ Email send attempt ${attempt} failed:`, error.message || error.status);
      
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        console.error('❌ Non-retryable error detected, stopping attempts');
        break;
      }
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`🔄 Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// ═══════════════════════════════════════════════════════════════
// ✅ SELLER CREDENTIALS EMAIL (APPROVAL)
// ═══════════════════════════════════════════════════════════════

export const sendSellerCredentialsEmail = async (
  email: string,
  businessName: string,
  fullName: string,
  password: string
): Promise<EmailResult> => {
  const startTime = Date.now();
  
  try {
    console.log('📧 Starting seller credentials email delivery process for:', email);
    
    const validation = validateEmailParams({
      to_email: email,
      to_name: fullName,
      business_name: businessName
    });
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        details: { validationErrors: validation.errors },
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured properly',
        details: {
          healthCheck,
          fallbackAction: 'Manual credential sharing required'
        },
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service',
        details: { 
          issue: 'EmailJS initialization failed',
          fallbackAction: 'Check public key configuration' 
        },
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    const templateParams: EmailTemplateParams = {
      to_email: email.trim(),
      to_name: fullName.trim(),
      business_name: businessName.trim(),
      login_email: email.trim(),
      login_password: password,
      login_url: `${window.location.origin}/login`,
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      current_year: new Date().getFullYear().toString(),
      created_date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      from_name: 'TileVision Team',
      website_url: window.location.origin,
      email_type: 'approval',
      timestamp: new Date().toISOString()
    };
    
    debugEmailParameters(templateParams, 'APPROVAL');
    
    console.log('📤 Sending approval email with validated params:', {
      to_email: templateParams.to_email,
      business_name: templateParams.business_name,
      to_name: templateParams.to_name,
      email_type: templateParams.email_type
    });
    
    const emailResponse = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ Seller credentials email delivered successfully in ${duration}ms`);
    
    return {
      success: true,
      details: {
        status: emailResponse.status,
        text: emailResponse.text,
        recipient: email,
        businessName: businessName,
        emailType: 'approval',
        deliveryTime: duration,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Seller credentials email delivery failed after ${duration}ms:`, error);
    
    let errorMessage = 'Email delivery failed';
    let errorCategory = 'unknown_error';
    
    if (error.status === 400) {
      errorMessage = 'Invalid email configuration or template parameters';
      errorCategory = 'configuration_error';
    } else if (error.status === 401) {
      errorMessage = 'Email service authentication failed - check public key';
      errorCategory = 'auth_error';
    } else if (error.status === 403) {
      errorMessage = 'Email service access forbidden - check account status';
      errorCategory = 'access_error';
    } else if (error.status === 404) {
      errorMessage = 'Email template not found - verify template ID';
      errorCategory = 'template_error';
    } else if (error.status === 429) {
      errorMessage = 'Email service rate limit exceeded - try again later';
      errorCategory = 'rate_limit_error';
    } else if (error.status >= 500) {
      errorMessage = 'Email service server error - temporary issue';
      errorCategory = 'server_error';
    } else if (error.message) {
      errorMessage = error.message;
      errorCategory = 'api_error';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error,
        errorCategory,
        status: error.status,
        recipient: email,
        businessName: businessName,
        deliveryTime: duration,
        timestamp: new Date().toISOString(),
        recommendations: getErrorRecommendations(errorCategory)
      },
      timestamp: new Date().toISOString()
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ SELLER REJECTION EMAIL - COMPLETE WITH ALL VARIABLES
// ═══════════════════════════════════════════════════════════════

export const sendSellerRejectionEmail = async (
  email: string,
  businessName: string,
  ownerName: string,
  rejectionReason?: string
): Promise<EmailResult> => {
  const startTime = Date.now();
  
  try {
    console.log('📧 Starting seller rejection email delivery process for:', email);
    
    const validation = validateEmailParams({
      to_email: email,
      to_name: ownerName,
      business_name: businessName
    });
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        details: { validationErrors: validation.errors },
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured properly',
        details: {
          healthCheck,
          fallbackAction: 'Manual notification required'
        },
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service',
        details: { 
          issue: 'EmailJS initialization failed',
          fallbackAction: 'Check public key configuration' 
        },
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    // ✅ COMPLETE REJECTION EMAIL PARAMETERS - ALL VARIABLES INCLUDED
    const templateParams: EmailTemplateParams = {
      // Basic recipient info
      to_email: email.trim(),
      to_name: ownerName.trim(),
      business_name: businessName.trim(),
      
      // Rejection specific data
      rejection_reason: (rejectionReason || `Dear ${ownerName},

Thank you for your interest in joining TileVision as a seller partner.

After careful review of your application for ${businessName}, we regret to inform you that we cannot approve your seller account at this time.

Common reasons for rejection include:
• Incomplete or unclear business documentation
• Business category not currently supported on our platform
• Product quality standards not meeting our requirements
• Verification requirements not properly fulfilled
• Business information requiring additional validation

We encourage you to review our seller guidelines and requirements. You are welcome to reapply after addressing the mentioned concerns.

Thank you for your understanding.

Best regards,
TileVision Seller Support Team`).trim(),
      
      // Company information - ALL REQUIRED VARIABLES
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      from_name: 'TileVision Team',
      website_url: window.location.origin, // ✅ CRITICAL - Was missing before
      reapply_url: `${window.location.origin}/seller-request`,
      
      // Date information
      current_year: new Date().getFullYear().toString(),
      rejection_date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      
      // Email type identifier
      email_type: 'rejection',
      
      // Metadata
      timestamp: new Date().toISOString()
    };
    
    // ✅ DEBUG OUTPUT - Shows all parameters
    debugEmailParameters(templateParams, 'REJECTION');
    
    console.log('📤 Sending rejection email with validated params:', {
      to_email: templateParams.to_email,
      business_name: templateParams.business_name,
      to_name: templateParams.to_name,
      email_type: templateParams.email_type,
      rejection_reason_length: templateParams.rejection_reason?.length || 0
    });
    
    const emailResponse = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ Seller rejection email delivered successfully in ${duration}ms`);
    
    return {
      success: true,
      details: {
        status: emailResponse.status,
        text: emailResponse.text,
        recipient: email,
        businessName: businessName,
        emailType: 'rejection',
        deliveryTime: duration,
        rejectionReason: rejectionReason,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Seller rejection email delivery failed after ${duration}ms:`, error);
    
    let errorMessage = 'Rejection email delivery failed';
    let errorCategory = 'unknown_error';
    
    if (error.status === 400) {
      errorMessage = 'Invalid email configuration or template parameters';
      errorCategory = 'configuration_error';
    } else if (error.status === 401) {
      errorMessage = 'Email service authentication failed - check public key';
      errorCategory = 'auth_error';
    } else if (error.status === 403) {
      errorMessage = 'Email service access forbidden - check account status';
      errorCategory = 'access_error';
    } else if (error.status === 404) {
      errorMessage = 'Email template not found - verify template ID';
      errorCategory = 'template_error';
    } else if (error.status === 429) {
      errorMessage = 'Email service rate limit exceeded - try again later';
      errorCategory = 'rate_limit_error';
    } else if (error.status >= 500) {
      errorMessage = 'Email service server error - temporary issue';
      errorCategory = 'server_error';
    } else if (error.message) {
      errorMessage = error.message;
      errorCategory = 'api_error';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error,
        errorCategory,
        status: error.status,
        recipient: email,
        businessName: businessName,
        deliveryTime: duration,
        timestamp: new Date().toISOString(),
        recommendations: getErrorRecommendations(errorCategory)
      },
      timestamp: new Date().toISOString()
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ TEST EMAIL FUNCTION
// ═══════════════════════════════════════════════════════════════

export const sendTestEmail = async (testEmail?: string): Promise<EmailResult> => {
  try {
    console.log('🧪 Sending comprehensive test email...');
    
    const targetEmail = testEmail || 'test@example.com';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      return {
        success: false,
        error: 'Invalid test email format',
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured for testing',
        details: healthCheck,
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service for testing',
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    const testParams: EmailTemplateParams = {
      to_email: targetEmail,
      to_name: 'Test User',
      business_name: 'Test Business Ltd.',
      login_email: targetEmail,
      login_password: 'TestPass123!@#',
      login_url: `${window.location.origin}/login`,
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      current_year: new Date().getFullYear().toString(),
      created_date: new Date().toLocaleDateString('en-IN'),
      from_name: 'TileVision Team',
      website_url: window.location.origin,
      email_type: 'approval',
      timestamp: new Date().toISOString(),
      test_mode: true
    };
    
    debugEmailParameters(testParams, 'TEST');
    
    const response = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      testParams
    );
    
    console.log('✅ Test email sent successfully:', response);
    
    return {
      success: true,
      details: {
        message: 'Test email sent successfully',
        status: response.status,
        testEmail: targetEmail,
        timestamp: new Date().toISOString(),
        configurationVerified: true
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    
    return {
      success: false,
      error: `Test email failed: ${error.message || error.status || 'Unknown error'}`,
      details: {
        originalError: error,
        testEmail: testEmail,
        timestamp: new Date().toISOString(),
        recommendations: ['Check EmailJS configuration', 'Verify template variables', 'Test with different email']
      },
      timestamp: new Date().toISOString()
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ CUSTOM EMAIL FUNCTION (GENERIC)
// ═══════════════════════════════════════════════════════════════

export const sendCustomEmail = async (
  recipientEmail: string,
  subject: string,
  message: string,
  recipientName?: string
): Promise<EmailResult> => {
  try {
    console.log('📧 Sending custom email to:', recipientEmail);
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured'
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service'
      };
    }
    
    const config = getEmailServiceConfig();
    
    const templateParams = {
      to_email: recipientEmail,
      to_name: recipientName || 'User',
      subject: subject,
      message: message,
      company_name: 'TileVision',
      timestamp: new Date().toLocaleDateString('en-IN')
    };
    
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    console.log('✅ Custom email sent successfully');
    
    return {
      success: true,
      details: {
        status: response.status,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (error: any) {
    console.error('❌ Custom email failed:', error);
    
    return {
      success: false,
      error: error.message || 'Custom email delivery failed',
      details: { originalError: error }
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ TEMPLATE VALIDATION
// ═══════════════════════════════════════════════════════════════

export const validateEmailTemplate = async (): Promise<EmailResult> => {
  try {
    console.log('🔍 Validating email template...');
    
    const config = getEmailServiceConfig();
    
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      return {
        success: false,
        error: 'Email configuration incomplete',
        details: {
          serviceId: !!config.serviceId,
          templateId: !!config.templateId,
          publicKey: !!config.publicKey
        }
      };
    }
    
    const testResult = await sendTestEmail('validation@test.com');
    
    return {
      success: testResult.success,
      error: testResult.success ? undefined : 'Template validation failed',
      details: {
        templateValid: testResult.success,
        testResult: testResult
      }
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: 'Template validation error',
      details: { originalError: error }
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ ERROR HANDLING HELPERS
// ═══════════════════════════════════════════════════════════════

const getErrorRecommendations = (errorCategory: string): string[] => {
  const recommendations: { [key: string]: string[] } = {
    configuration_error: [
      'Verify EmailJS service ID and template ID',
      'Check template variables match function parameters',
      'Ensure EmailJS account is active'
    ],
    auth_error: [
      'Verify EmailJS public key is correct',
      'Check if EmailJS account has required permissions',
      'Regenerate public key if necessary'
    ],
    template_error: [
      'Verify template ID exists in EmailJS dashboard',
      'Check template content and variables',
      'Ensure template is published and active'
    ],
    rate_limit_error: [
      'Wait before sending more emails',
      'Consider upgrading EmailJS plan',
      'Implement email queuing system'
    ],
    server_error: [
      'Retry sending email after some time',
      'Check EmailJS service status',
      'Contact EmailJS support if issue persists'
    ]
  };
  
  return recommendations[errorCategory] || [
    'Check email service configuration',
    'Verify network connectivity',
    'Contact technical support with error details'
  ];
};

// ═══════════════════════════════════════════════════════════════
// ✅ STATISTICS & MONITORING
// ═══════════════════════════════════════════════════════════════

export const getEmailServiceStats = (): any => {
  const config = getEmailServiceConfig();
  
  return {
    configurationStatus: {
      serviceId: config.serviceId ? (config.serviceId.startsWith('service_') ? 'Valid' : 'Invalid Format') : 'Missing',
      templateId: config.templateId ? (config.templateId.startsWith('template_') ? 'Valid' : 'Invalid Format') : 'Missing',
      publicKey: config.publicKey ? (config.publicKey.length > 10 ? 'Valid' : 'Too Short') : 'Missing'
    },
    environment: config.environment,
    isReady: !!(config.serviceId && config.templateId && config.publicKey),
    lastChecked: new Date().toISOString(),
    version: '2.0.0',
    features: [
      'Retry Logic',
      'Input Validation', 
      'Error Categorization',
      'Performance Monitoring',
      'Comprehensive Logging',
      'Debugging Support'
    ]
  };
};

// ═══════════════════════════════════════════════════════════════
// ✅ TESTING & DIAGNOSTICS FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const testApprovalEmailDirect = async (email?: string): Promise<void> => {
  console.log('🧪 Testing APPROVAL email directly...');
  
  const result = await sendSellerCredentialsEmail(
    email || 'test@example.com',
    'Test Business Ltd',
    'Test Owner Name',
    'TestPassword123!@#'
  );
  
  console.log('✅ Approval Email Test Result:', {
    success: result.success,
    error: result.error,
    details: result.details
  });
  
  if (result.success) {
    alert('✅ Approval Email Sent Successfully!\nCheck your inbox.');
  } else {
    alert(`❌ Approval Email Failed!\n\nError: ${result.error}\n\nCheck console for details.`);
  }
};

export const testRejectionEmailDirect = async (email?: string): Promise<void> => {
  console.log('🧪 Testing REJECTION email directly...');
  
  const result = await sendSellerRejectionEmail(
    email || 'test@example.com',
    'Test Business Ltd',
    'Test Owner Name',
    'Your application needs additional documentation and verification before we can proceed with approval.'
  );
  
  console.log('❌ Rejection Email Test Result:', {
    success: result.success,
    error: result.error,
    details: result.details
  });
  
  if (result.success) {
    alert('✅ Rejection Email Sent Successfully!\nCheck your inbox.');
  } else {
    alert(`❌ Rejection Email Failed!\n\nError: ${result.error}\n\nCheck console for details.`);
  }
};

export const testBothEmailTypes = async (email?: string): Promise<void> => {
  console.log('🧪 Testing BOTH email types...');
  
  const testEmail = email || prompt('Enter test email address:') || 'test@example.com';
  
  console.log('1️⃣ Testing Approval Email...');
  await testApprovalEmailDirect(testEmail);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('2️⃣ Testing Rejection Email...');
  await testRejectionEmailDirect(testEmail);
  
  console.log('✅ Both email tests completed!');
};

export const getEmailServiceDiagnostics = async (): Promise<void> => {
  console.log('🔍 Running Email Service Diagnostics...\n');
  
  const config = getEmailServiceConfig();
  const healthCheck = await checkEmailServiceHealth();
  const stats = getEmailServiceStats();
  
  console.log('📧 EMAIL SERVICE DIAGNOSTICS REPORT\n');
  console.log('═══════════════════════════════════════════\n');
  
  console.log('1️⃣ Configuration:');
  console.table({
    'Service ID': config.serviceId || '❌ Not Set',
    'Template ID': config.templateId || '❌ Not Set',
    'Public Key': config.publicKey ? `${config.publicKey.substring(0, 10)}...` : '❌ Not Set',
    'Environment': config.environment
  });
  
  console.log('\n2️⃣ Health Status:');
  console.table({
    'Configured': healthCheck.configured ? '✅ Yes' : '❌ No',
    'Message': healthCheck.message,
    'Service ID Status': healthCheck.details.serviceId,
    'Template ID Status': healthCheck.details.templateId,
    'Public Key Status': healthCheck.details.publicKey
  });
  
  if (healthCheck.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    healthCheck.warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }
  
  if (healthCheck.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    healthCheck.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
  
  console.log('\n3️⃣ Service Statistics:');
  console.table(stats.configurationStatus);
  
  console.log('\n4️⃣ Features:');
  stats.features.forEach((feature: string) => {
    console.log(`   ✅ ${feature}`);
  });
  
  console.log('\n═══════════════════════════════════════════');
  console.log(`Last checked: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════\n');
  
  const diagnosticsText = `
EMAIL SERVICE DIAGNOSTICS REPORT
═══════════════════════════════════════════

Configuration:
- Service ID: ${config.serviceId || 'Not Set'}
- Template ID: ${config.templateId || 'Not Set'}
- Public Key: ${config.publicKey ? 'Set' : 'Not Set'}
- Environment: ${config.environment}

Health Status:
- Configured: ${healthCheck.configured ? 'Yes' : 'No'}
- Message: ${healthCheck.message}

Warnings: ${healthCheck.warnings.length}
${healthCheck.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Recommendations: ${healthCheck.recommendations.length}
${healthCheck.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Features: ${stats.features.length}
${stats.features.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

Last checked: ${new Date().toLocaleString()}
`;
  
  try {
    await navigator.clipboard.writeText(diagnosticsText);
    console.log('📋 Diagnostics copied to clipboard!');
  } catch (e) {
    console.log('⚠️ Could not copy to clipboard');
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ EMAIL SERVICE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

export const initEmailService = async (): Promise<boolean> => {
  try {
    console.log('🚀 Initializing TileVision email service...');
    
    const healthCheck = await checkEmailServiceHealth();
    
    if (healthCheck.configured) {
      const initialized = initializeEmailJS();
      
      if (initialized) {
        console.log('✅ TileVision email service ready for production');
        return true;
      } else {
        console.log('❌ Email service initialization failed');
        return false;
      }
    } else {
      console.log('⚠️ Email service not configured - manual delivery mode active');
      console.log('📋 Configuration requirements:', healthCheck.recommendations);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Email service initialization error:', error);
    return false;
  }
};
// lib/emailService.ts - ADD THESE NEW FUNCTIONS TO EXISTING FILE

// ═══════════════════════════════════════════════════════════════
// ✅ PASSWORD RESET NOTIFICATION EMAIL
// ═══════════════════════════════════════════════════════════════

export const sendPasswordResetNotification = async (
  email: string,
  businessName: string,
  ownerName: string
): Promise<EmailResult> => {
  const startTime = Date.now();
  
  try {
    console.log('🔑 Sending password reset notification to:', email);
    
    const validation = validateEmailParams({
      to_email: email,
      to_name: ownerName,
      business_name: businessName
    });
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        details: { validationErrors: validation.errors },
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured properly',
        details: {
          healthCheck,
          fallbackAction: 'Manual notification required'
        },
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service',
        details: { 
          issue: 'EmailJS initialization failed',
          fallbackAction: 'Check public key configuration' 
        },
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    const templateParams: EmailTemplateParams = {
      to_email: email.trim(),
      to_name: ownerName.trim(),
      business_name: businessName.trim(),
      
      // Password reset specific
      reset_message: `Dear ${ownerName},

A password reset has been initiated for your TileVision seller account.

Business: ${businessName}
Email: ${email}

You will receive a password reset link from Firebase Authentication at this email address shortly.

Important Security Information:
• The reset link will expire in 1 hour
• If you did not request this reset, please contact us immediately
• Never share your password reset link with anyone
• Our team will never ask for your password

After resetting your password, you can log in at: ${window.location.origin}/login

If you have any questions or concerns, please contact our support team.

Best regards,
TileVision Admin Team`,
      
      // Standard fields
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      from_name: 'TileVision Admin Team',
      website_url: window.location.origin,
      login_url: `${window.location.origin}/login`,
      current_year: new Date().getFullYear().toString(),
      
      // Email type
      email_type: 'password_reset_notification',
      
      // Metadata
      timestamp: new Date().toISOString()
    };
    
    debugEmailParameters(templateParams, 'PASSWORD RESET NOTIFICATION');
    
    console.log('📤 Sending password reset notification with validated params');
    
    const emailResponse = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ Password reset notification delivered successfully in ${duration}ms`);
    
    return {
      success: true,
      details: {
        status: emailResponse.status,
        text: emailResponse.text,
        recipient: email,
        businessName: businessName,
        emailType: 'password_reset_notification',
        deliveryTime: duration,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Password reset notification failed after ${duration}ms:`, error);
    
    let errorMessage = 'Password reset notification failed';
    let errorCategory = 'unknown_error';
    
    if (error.status === 400) {
      errorMessage = 'Invalid email configuration or template parameters';
      errorCategory = 'configuration_error';
    } else if (error.status === 401) {
      errorMessage = 'Email service authentication failed - check public key';
      errorCategory = 'auth_error';
    } else if (error.status === 403) {
      errorMessage = 'Email service access forbidden - check account status';
      errorCategory = 'access_error';
    } else if (error.status === 404) {
      errorMessage = 'Email template not found - verify template ID';
      errorCategory = 'template_error';
    } else if (error.status === 429) {
      errorMessage = 'Email service rate limit exceeded - try again later';
      errorCategory = 'rate_limit_error';
    } else if (error.status >= 500) {
      errorMessage = 'Email service server error - temporary issue';
      errorCategory = 'server_error';
    } else if (error.message) {
      errorMessage = error.message;
      errorCategory = 'api_error';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error,
        errorCategory,
        status: error.status,
        recipient: email,
        businessName: businessName,
        deliveryTime: duration,
        timestamp: new Date().toISOString(),
        recommendations: getErrorRecommendations(errorCategory)
      },
      timestamp: new Date().toISOString()
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ ACCOUNT DELETION EMAIL
// ═══════════════════════════════════════════════════════════════

export const sendAccountDeletionEmail = async (
  email: string,
  businessName: string,
  ownerName: string,
  deletionReason?: string
): Promise<EmailResult> => {
  const startTime = Date.now();
  
  try {
    console.log('🗑️ Sending account deletion email to:', email);
    
    const validation = validateEmailParams({
      to_email: email,
      to_name: ownerName,
      business_name: businessName
    });
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        details: { validationErrors: validation.errors },
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured properly',
        details: {
          healthCheck,
          fallbackAction: 'Manual notification required'
        },
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service',
        details: { 
          issue: 'EmailJS initialization failed',
          fallbackAction: 'Check public key configuration' 
        },
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    const templateParams: EmailTemplateParams = {
      to_email: email.trim(),
      to_name: ownerName.trim(),
      business_name: businessName.trim(),
      
      // Deletion specific
      deletion_message: (deletionReason || `Dear ${ownerName},

Your TileVision seller account has been deactivated.

Business: ${businessName}
Email: ${email}
Deactivation Date: ${new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

Your account has been marked as deleted and is no longer accessible. This action was taken by a TileVision administrator.

What This Means:
• You can no longer log in to your seller account
• Your tiles have been archived and are no longer visible
• Your business profile is no longer active
• All your data has been preserved for record-keeping

Data Retention Policy:
• Your data will be retained for 90 days for compliance purposes
• After 90 days, all personal data will be permanently deleted
• Business transaction records will be retained as per legal requirements

If You Believe This Is an Error:
Please contact our support team immediately at support@tilevision.com with your business details. Our team will review your case and assist you.

Contact Support:
Email: support@tilevision.com
Subject: Account Deletion Review - ${businessName}

We appreciate your time with TileVision. If you wish to reapply in the future, please visit our seller registration page.

Best regards,
TileVision Team`).trim(),
      
      deletion_reason: deletionReason || 'Administrative action',
      deletion_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      
      // Standard fields
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      from_name: 'TileVision Team',
      website_url: window.location.origin,
      reapply_url: `${window.location.origin}/seller-request`,
      current_year: new Date().getFullYear().toString(),
      
      // Email type
      email_type: 'account_deletion',
      
      // Metadata
      timestamp: new Date().toISOString()
    };
    
    debugEmailParameters(templateParams, 'ACCOUNT DELETION');
    
    console.log('📤 Sending account deletion email with validated params');
    
    const emailResponse = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ Account deletion email delivered successfully in ${duration}ms`);
    
    return {
      success: true,
      details: {
        status: emailResponse.status,
        text: emailResponse.text,
        recipient: email,
        businessName: businessName,
        emailType: 'account_deletion',
        deliveryTime: duration,
        deletionReason: deletionReason,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Account deletion email failed after ${duration}ms:`, error);
    
    let errorMessage = 'Account deletion email failed';
    let errorCategory = 'unknown_error';
    
    if (error.status === 400) {
      errorMessage = 'Invalid email configuration or template parameters';
      errorCategory = 'configuration_error';
    } else if (error.status === 401) {
      errorMessage = 'Email service authentication failed - check public key';
      errorCategory = 'auth_error';
    } else if (error.status === 403) {
      errorMessage = 'Email service access forbidden - check account status';
      errorCategory = 'access_error';
    } else if (error.status === 404) {
      errorMessage = 'Email template not found - verify template ID';
      errorCategory = 'template_error';
    } else if (error.status === 429) {
      errorMessage = 'Email service rate limit exceeded - try again later';
      errorCategory = 'rate_limit_error';
    } else if (error.status >= 500) {
      errorMessage = 'Email service server error - temporary issue';
      errorCategory = 'server_error';
    } else if (error.message) {
      errorMessage = error.message;
      errorCategory = 'api_error';
    }
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error,
        errorCategory,
        status: error.status,
        recipient: email,
        businessName: businessName,
        deliveryTime: duration,
        timestamp: new Date().toISOString(),
        recommendations: getErrorRecommendations(errorCategory)
      },
      timestamp: new Date().toISOString()
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ ACCOUNT STATUS CHANGE EMAIL (GENERIC)
// ═══════════════════════════════════════════════════════════════

export const sendAccountStatusChangeEmail = async (
  email: string,
  businessName: string,
  ownerName: string,
  oldStatus: string,
  newStatus: string,
  reason?: string
): Promise<EmailResult> => {
  const startTime = Date.now();
  
  try {
    console.log('📧 Sending account status change email to:', email);
    
    const validation = validateEmailParams({
      to_email: email,
      to_name: ownerName,
      business_name: businessName
    });
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        details: { validationErrors: validation.errors },
        timestamp: new Date().toISOString()
      };
    }
    
    const healthCheck = await checkEmailServiceHealth();
    if (!healthCheck.configured) {
      return {
        success: false,
        error: 'Email service not configured properly',
        timestamp: new Date().toISOString()
      };
    }
    
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: 'Failed to initialize email service',
        timestamp: new Date().toISOString()
      };
    }
    
    const config = getEmailServiceConfig();
    
    const templateParams: EmailTemplateParams = {
      to_email: email.trim(),
      to_name: ownerName.trim(),
      business_name: businessName.trim(),
      
      // Status change specific
      status_change_message: `Dear ${ownerName},

Your TileVision seller account status has been updated.

Business: ${businessName}
Previous Status: ${oldStatus}
New Status: ${newStatus}
Change Date: ${new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

${reason ? `Reason: ${reason}\n\n` : ''}

What This Means:
${newStatus === 'active' ? '• Your account is now fully active\n• You can access all seller features\n• Your tiles are visible to customers' : ''}
${newStatus === 'inactive' ? '• Your account has been temporarily deactivated\n• You cannot access seller features\n• Your tiles are not visible to customers' : ''}
${newStatus === 'suspended' ? '• Your account has been suspended\n• Please contact support for more information\n• Your tiles are not visible to customers' : ''}

Next Steps:
${newStatus === 'active' ? '• Log in to your account at ' + window.location.origin + '/login\n• Start managing your tiles and inventory' : ''}
${newStatus !== 'active' ? '• Contact support at support@tilevision.com for more information\n• Review our terms of service and seller guidelines' : ''}

If you have any questions or concerns, please contact our support team.

Best regards,
TileVision Team`,
      
      old_status: oldStatus,
      new_status: newStatus,
      change_reason: reason || 'Administrative update',
      
      // Standard fields
      company_name: 'TileVision',
      support_email: 'support@tilevision.com',
      from_name: 'TileVision Team',
      website_url: window.location.origin,
      login_url: `${window.location.origin}/login`,
      current_year: new Date().getFullYear().toString(),
      
      // Email type
      email_type: 'status_change',
      
      // Metadata
      timestamp: new Date().toISOString()
    };
    
    debugEmailParameters(templateParams, 'STATUS CHANGE');
    
    const emailResponse = await sendEmailWithRetry(
      config.serviceId,
      config.templateId,
      templateParams
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ Status change email delivered successfully in ${duration}ms`);
    
    return {
      success: true,
      details: {
        status: emailResponse.status,
        recipient: email,
        emailType: 'status_change',
        deliveryTime: duration,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Status change email failed after ${duration}ms:`, error);
    
    return {
      success: false,
      error: error.message || 'Status change email failed',
      details: {
        originalError: error,
        recipient: email,
        deliveryTime: duration,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }
};
// ═══════════════════════════════════════════════════════════════
// ✅ AUTO-INITIALIZATION
// ═══════════════════════════════════════════════════════════════

(async () => {
  try {
    await initEmailService();
  } catch (error) {
    console.warn('⚠️ Email service auto-initialization failed:', error);
  }
})();

// ═══════════════════════════════════════════════════════════════
// ✅ END OF FILE - PRODUCTION READY v2.0.0
// ═══════════════════════════════════════════════════════════════