import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value?: string) => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  requireInput?: boolean;
  inputPlaceholder?: string;
  requireConfirmText?: string; // e.g., "DELETE" for dangerous actions
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requireInput = false,
  inputPlaceholder = '',
  requireConfirmText = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireConfirmText && confirmValue !== requireConfirmText) {
      return;
    }
    onConfirm(requireInput ? inputValue : undefined);
    setInputValue('');
    setConfirmValue('');
  };

  const handleClose = () => {
    setInputValue('');
    setConfirmValue('');
    onClose();
  };

  const typeConfig = {
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600 hover:bg-green-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const canConfirm = requireConfirmText 
    ? confirmValue === requireConfirmText 
    : true;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
            <h3 className="font-bold text-lg sm:text-xl text-gray-800">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
            <p className={`${config.text} text-sm whitespace-pre-line`}>
              {message}
            </p>
          </div>

          {/* Optional Input */}
          {requireInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputPlaceholder}
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                rows={3}
              />
            </div>
          )}

          {/* Confirmation Text Input (for dangerous actions) */}
          {requireConfirmText && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">{requireConfirmText}</code> to confirm:
              </label>
              <input
                type="text"
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
                placeholder={requireConfirmText}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm ${
                  confirmValue === requireConfirmText
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 sm:p-6 pt-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-1 px-4 py-2.5 ${config.buttonBg} text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};