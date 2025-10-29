// // src/components/admin/AnalyticsErrorBoundary.tsx

// import React, { Component, ErrorInfo, ReactNode } from 'react';
// import { AlertCircle, RefreshCw } from 'lucide-react';

// interface Props {
//   children: ReactNode;
//   fallback?: ReactNode;
// }

// interface State {
//   hasError: boolean;
//   error: Error | null;
// }

// export class AnalyticsErrorBoundary extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: Error): State {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     console.error('Analytics Error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       if (this.props.fallback) {
//         return this.props.fallback;
//       }

//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="w-10 h-10 text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               Something went wrong
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {this.state.error?.message || 'An unexpected error occurred'}
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 mx-auto"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Reload Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }  

// src/components/admin/AnalyticsErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Analytics Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-md w-full text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-red-600" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
              Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}