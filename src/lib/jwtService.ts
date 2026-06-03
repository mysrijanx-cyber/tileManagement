
import CryptoJS from 'crypto-js';

interface JWTPayload {
  user_id: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  business_id?: string;
  permissions: string[];
  iat: number;
  exp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class JWTService {
  private readonly ACCESS_TOKEN_KEY = 'tile_access_token';
  private readonly REFRESH_TOKEN_KEY = 'tile_refresh_token';
  private readonly SECRET_KEY = import.meta.env.VITE_JWT_SECRET || 'fallback-secret-key-min-32-chars-long';
  private readonly ACCESS_TOKEN_EXPIRY = 30 * 60; // 30 minutes
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

  // ✅ Generate production-ready JWT tokens
  generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
    const now = Math.floor(Date.now() / 1000);
    
    const accessPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.ACCESS_TOKEN_EXPIRY
    };

    const refreshPayload = {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      iat: now,
      exp: now + this.REFRESH_TOKEN_EXPIRY
    };

    try {
      const accessToken = this.createToken(accessPayload);
      const refreshToken = this.createToken(refreshPayload);
      
      console.log('✅ JWT tokens generated successfully');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('❌ JWT token generation failed:', error);
      throw new Error('Failed to generate authentication tokens');
    }
  }

  // ✅ Create encrypted JWT token
  private createToken(payload: any): string {
    try {
      const header = { alg: 'HS256', typ: 'JWT' };
      const headerEncoded = btoa(JSON.stringify(header));
      const payloadEncoded = btoa(JSON.stringify(payload));
      
      const signature = CryptoJS.HmacSHA256(
        `${headerEncoded}.${payloadEncoded}`, 
        this.SECRET_KEY
      ).toString();
      
      const token = `${headerEncoded}.${payloadEncoded}.${signature}`;
      
      // Encrypt the complete token
      return CryptoJS.AES.encrypt(token, this.SECRET_KEY).toString();
    } catch (error) {
      console.error('❌ Token creation failed:', error);
      throw new Error('Failed to create authentication token');
    }
  }

  // ✅ Verify and decode token with proper error handling
  verifyToken(encryptedToken: string): JWTPayload | null {
    try {
      if (!encryptedToken || encryptedToken.trim() === '') {
        console.warn('🔒 Empty token provided');
        return null;
      }

      // Decrypt the token
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, this.SECRET_KEY);
      const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedToken) {
        console.warn('🔒 Token decryption failed');
        return null;
      }

      // Parse JWT token
      const parts = decryptedToken.split('.');
      if (parts.length !== 3) {
        console.warn('🔒 Invalid token format');
        return null;
      }

      const [headerEncoded, payloadEncoded, signature] = parts;
      
      // Verify signature
      const expectedSignature = CryptoJS.HmacSHA256(
        `${headerEncoded}.${payloadEncoded}`, 
        this.SECRET_KEY
      ).toString();
      
      if (signature !== expectedSignature) {
        console.warn('🔒 Token signature verification failed');
        return null;
      }

      // Decode payload
      const payload = JSON.parse(atob(payloadEncoded));
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn('🔒 Token has expired');
        return null;
      }

      console.log('✅ Token verified successfully');
      return payload;
    } catch (error) {
      console.error('🔒 Token verification failed:', error);
      return null;
    }
  }

  // ✅ Store tokens securely
  storeTokens(tokens: TokenPair): void {
    try {
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('Invalid tokens provided');
      }

      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      
      // Verification
      const stored = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!stored) {
        throw new Error('Token storage verification failed');
      }
      
      console.log('✅ Tokens stored successfully');
    } catch (error) {
      console.error('🔒 Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  // ✅ Get access token with error handling
  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!token) {
        console.log('🔒 No access token in storage');
        return null;
      }
      
      console.log('✅ Access token retrieved from storage');
      return token;
    } catch (error) {
      console.error('🔒 Failed to retrieve access token:', error);
      return null;
    }
  }

  // ✅ Get refresh token
  getRefreshToken(): string | null {
    try {
      const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!token) {
        console.log('🔒 No refresh token in storage');
        return null;
      }
      
      console.log('✅ Refresh token retrieved from storage');
      return token;
    } catch (error) {
      console.error('🔒 Failed to retrieve refresh token:', error);
      return null;
    }
  }

  // ✅ Clear tokens securely
  clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem('auth_sync_token');
      console.log('✅ Tokens cleared successfully');
    } catch (error) {
      console.error('🔒 Failed to clear tokens:', error);
    }
  }

  // ✅ Check if token needs refresh
  needsRefresh(token: string): boolean {
    try {
      const payload = this.verifyToken(token);
      if (!payload) return true;
      
      const now = Math.floor(Date.now() / 1000);
      const refreshThreshold = payload.exp - (5 * 60); // 5 minutes before expiry
      
      return now >= refreshThreshold;
    } catch (error) {
      console.error('🔒 Token refresh check failed:', error);
      return true;
    }
  }

  // ✅ Get current user from token
  getCurrentUser(): JWTPayload | null {
    try {
      const token = this.getAccessToken();
      if (!token) {
        console.log('🔒 No token available for getCurrentUser');
        return null;
      }
      
      const user = this.verifyToken(token);
      if (user) {
        console.log('✅ Current user retrieved:', user.email, user.role);
      }
      return user;
    } catch (error) {
      console.error('🔒 Failed to get current user:', error);
      return null;
    }
  }

  // ✅ Check permissions
  hasPermission(permission: string): boolean {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;
      
      // Admin has all permissions
      if (user.role === 'admin') return true;
      
      // Check specific permission
      return user.permissions?.includes(permission) || 
             user.permissions?.includes('*') || 
             false;
    } catch (error) {
      console.error('🔒 Permission check failed:', error);
      return false;
    }
  }

  // ✅ Check role
  hasRole(requiredRoles: string | string[]): boolean {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;
      
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return roles.includes(user.role);
    } catch (error) {
      console.error('🔒 Role check failed:', error);
      return false;
    }
  }

  // ✅ Validate token structure
  isValidTokenFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      // Try to decrypt and verify basic structure
      const decryptedBytes = CryptoJS.AES.decrypt(token, this.SECRET_KEY);
      const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedToken) return false;
      
      const parts = decryptedToken.split('.');
      return parts.length === 3;
    } catch (error) {
      return false;
    }
  }
}

export const jwtService = new JWTService();