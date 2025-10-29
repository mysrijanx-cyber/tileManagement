// import React from 'react';
// import { AlertTriangle, RefreshCw } from 'lucide-react';

// interface State {
//   hasError: boolean;
//   error?: Error;
// }

// export class WorkerErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   State
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error): State {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Worker component error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
//             <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold text-gray-800 mb-4">
//               Something went wrong
//             </h2>
//             <p className="text-gray-600 mb-6">
//               The worker system encountered an error. Please refresh or contact support.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mx-auto"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }  
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class WorkerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Worker component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-3 sm:p-4 lg:p-6">
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              The worker system encountered an error. Please refresh or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 mx-auto transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}