// utils/errorHandler.ts
export class AppError extends Error {
    constructor(
      message: string,
      public code: string = 'UNKNOWN_ERROR',
      public statusCode: number = 500,
      public isOperational: boolean = true
    ) {
      super(message);
      this.name = 'AppError';
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const handleError = (error: unknown): AppError => {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(error.message, 'GENERIC_ERROR');
    }
    
    return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
  };
  
  export const logError = (error: AppError | Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    console.error('🔥 Application Error:', errorInfo);
    
    // In production, send to error monitoring service
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, or other monitoring service
    }
  };