import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary, getOptimizedImageUrl } from '../utils/cloudinaryUtils';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  folder?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  folder = 'tiles',
  placeholder = 'Upload image',
  disabled = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, folder, setProgress);
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      
      // Update with actual uploaded URL
      setPreview(imageUrl);
      onImageUploaded(imageUrl);
      
    } catch (error: any) {
      setError(error.message);
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      setProgress(0);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    onImageUploaded('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {preview ? (
        // Image Preview
        <div className="relative group">
          <img
            src={getOptimizedImageUrl(preview, { width: 200, height: 200 })}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-gray-300"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={openFileDialog}
              disabled={uploading}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Change image"
            >
              <Upload className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <div
          onClick={openFileDialog}
          className={`
            w-full h-32 border-2 border-dashed border-gray-300 rounded-lg 
            flex flex-col items-center justify-center cursor-pointer
            hover:border-gray-400 hover:bg-gray-50 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${uploading ? 'cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="text-center">
              <Loader className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{progress}%</p>
              <p className="text-xs text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-500">Click to browse</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Indicator */}
      {preview && !uploading && !error && (
        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <Check className="w-4 h-4" />
          Image uploaded successfully
        </div>
      )}
    </div>
  );
};