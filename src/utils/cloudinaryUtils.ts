// // Complete cloudinaryUtils.ts file
// export const uploadToCloudinary = async (
//     file: File,
//     folder: string = 'tiles',
//     onProgress?: (progress: number) => void
//   ): Promise<string> => {
    
//     // Basic validation
//     if (!file) {
//       throw new Error('No file provided');
//     }
  
//     if (!file.type.startsWith('image/')) {
//       throw new Error('Please select a valid image file');
//     }
  
//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       throw new Error('File size should be less than 5MB');
//     }
  
//     // Get environment variables
//     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//     const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tile_uploads';
  
//     if (!cloudName) {
//       throw new Error('Cloudinary configuration missing. Check your .env file.');
//     }
  
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', uploadPreset);
//       formData.append('cloud_name', cloudName);
//       formData.append('folder', folder);
//       formData.append('quality', 'auto');
//       formData.append('fetch_format', 'auto');
  
//       return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
        
//         // Progress tracking
//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable && onProgress) {
//             const progress = Math.round((event.loaded / event.total) * 100);
//             onProgress(progress);
//           }
//         };
        
//         // Success handler
//         xhr.onload = () => {
//           if (xhr.status === 200) {
//             try {
//               const response = JSON.parse(xhr.responseText);
//               if (response.secure_url) {
//                 console.log('✅ Image uploaded:', response.secure_url);
//                 resolve(response.secure_url);
//               } else {
//                 reject(new Error('No URL received from Cloudinary'));
//               }
//             } catch (error) {
//               reject(new Error('Failed to parse upload response'));
//             }
//           } else {
//             reject(new Error(`Upload failed: ${xhr.status}`));
//           }
//         };
        
//         // Error handler
//         xhr.onerror = () => reject(new Error('Network error during upload'));
        
//         // Send request
//         const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
//         xhr.open('POST', uploadUrl);
//         xhr.send(formData);
//       });
  
//     } catch (error: any) {
//       console.error('❌ Upload error:', error);
//       throw new Error(error.message || 'Failed to upload image');
//     }
//   };
  
//   // Optional: Image optimization helper
//   export const getOptimizedImageUrl = (
//     originalUrl: string,
//     options: {
//       width?: number;
//       height?: number;
//       quality?: 'auto' | number;
//     } = {}
//   ): string => {
//     if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
//       return originalUrl;
//     }
  
//     const { width = 800, height = 600, quality = 'auto' } = options;
    
//     const parts = originalUrl.split('/upload/');
//     if (parts.length !== 2) return originalUrl;
  
//     const baseUrl = parts[0];
//     const imagePath = parts[1];
    
//     const transformations = `w_${width},h_${height},c_fill,q_${quality}`;
    
//     return `${baseUrl}/upload/${transformations}/${imagePath}`;
//   }; 

// utils/cloudinaryUtils.ts
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

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size should be less than 5MB');
  }

  // Get config
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Check your .env file.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
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
          // Detailed error logging
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
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      console.log('🔄 Uploading to:', uploadUrl);
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

// Image optimization helper
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

// Configuration validation
export const validateCloudinaryConfig = (): boolean => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  const isValid = !!(cloudName && uploadPreset);
  
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
  console.log('Upload URL:', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`);
};