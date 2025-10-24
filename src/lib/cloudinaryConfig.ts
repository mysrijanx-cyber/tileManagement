

// Upload configuration
export const uploadConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tile_uploads',
  folder: 'tiles',
  maxFileSize: 5000000, // 5MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
};

// Main upload function (your existing XMLHttpRequest approach)
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'tiles',
  onProgress?: (progress: number) => void
): Promise<string> => {
  
  // Validation
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  if (file.size > uploadConfig.maxFileSize) {
    throw new Error('File size should be less than 5MB');
  }

  if (!uploadConfig.cloudName || !uploadConfig.uploadPreset) {
    throw new Error('Cloudinary configuration missing. Check your .env file.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadConfig.uploadPreset);
    formData.append('folder', folder);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };
      
      // Success/Error handler
      xhr.onload = () => {
        console.log('🔍 Cloudinary Response:', {
          status: xhr.status,
          response: xhr.responseText.substring(0, 200) + '...'
        });
        
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.secure_url) {
              console.log('✅ Upload successful:', response.secure_url);
              resolve(response.secure_url);
            } else {
              reject(new Error('No URL received from Cloudinary'));
            }
          } catch (error) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          console.error('❌ Upload failed:', {
            status: xhr.status,
            response: xhr.responseText
          });
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };
      
      // Network error handler
      xhr.onerror = () => {
        console.error('❌ Network error during upload');
        reject(new Error('Network error during upload'));
      };
      
      // Send request
      console.log('🔄 Uploading to:', uploadConfig.apiUrl);
      xhr.open('POST', uploadConfig.apiUrl);
      xhr.send(formData);
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

// Image optimization helper (no SDK needed)
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
  } = {}
): string => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  const { width = 800, height = 600, quality = 'auto' } = options;
  
  try {
    const parts = originalUrl.split('/upload/');
    if (parts.length !== 2) return originalUrl;

    const baseUrl = parts[0];
    const imagePath = parts[1];
    
    const transformations = `w_${width},h_${height},c_fill,q_${quality}`;
    
    return `${baseUrl}/upload/${transformations}/${imagePath}`;
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return originalUrl;
  }
};

// Validation helper
export const validateCloudinaryConfig = (): boolean => {
  const required = [
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  ];
  
  const isValid = required.every(Boolean);
  
  if (!isValid) {
    console.error('❌ Cloudinary configuration missing. Check your .env file.');
    console.log('Required variables:');
    console.log('- VITE_CLOUDINARY_CLOUD_NAME');
    console.log('- VITE_CLOUDINARY_UPLOAD_PRESET');
  }
  
  return isValid;
};

// Debug configuration
export const debugCloudinaryConfig = (): void => {
  console.log('🔧 Cloudinary Configuration Debug:');
  console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
  console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ? '✅ Set' : '❌ Missing');
  console.log('Upload URL:', uploadConfig.apiUrl);
  console.log('Max File Size:', `${uploadConfig.maxFileSize / 1024 / 1024}MB`);
  console.log('Allowed Formats:', uploadConfig.allowedFormats.join(', '));
};