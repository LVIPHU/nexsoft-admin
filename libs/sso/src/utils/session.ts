import type { SessionData } from '../types/sso.types.js';

const SESSION_KEY = 'sso_session';
const TOKEN_KEY = 'sso_token';

/**
 * Session storage utilities
 * Supports localStorage, sessionStorage, cookie, and memory storage
 */
export class SessionStorage {
  private storage: Storage | Map<string, string>;
  private storageType: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory';

  constructor(storageType: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory' = 'localStorage') {
    this.storageType = storageType;

    if (storageType === 'localStorage' && typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    } else if (storageType === 'sessionStorage' && typeof window !== 'undefined' && window.sessionStorage) {
      this.storage = window.sessionStorage;
    } else if (storageType === 'cookie') {
      this.storage = new Map(); // Cookie handling would need document.cookie parsing
    } else {
      this.storage = new Map();
    }
  }

  /**
   * Save session data
   */
  saveSession(session: SessionData): void {
    try {
      const data = JSON.stringify(session);
      if ((this.storageType === 'localStorage' || this.storageType === 'sessionStorage') && this.storage instanceof Storage) {
        this.storage.setItem(SESSION_KEY, data);
      } else if (this.storage instanceof Map) {
        this.storage.set(SESSION_KEY, data);
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * Get session data
   */
  getSession(): SessionData | null {
    try {
      let data: string | null = null;

      if ((this.storageType === 'localStorage' || this.storageType === 'sessionStorage') && this.storage instanceof Storage) {
        data = this.storage.getItem(SESSION_KEY);
      } else if (this.storage instanceof Map) {
        data = this.storage.get(SESSION_KEY) || null;
      }

      if (!data) {
        return null;
      }

      const session = JSON.parse(data) as SessionData;

      // Check if session is expired
      if (session.expiresAt && session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Clear session
   */
  clearSession(): void {
    try {
      if ((this.storageType === 'localStorage' || this.storageType === 'sessionStorage') && this.storage instanceof Storage) {
        this.storage.removeItem(SESSION_KEY);
        this.storage.removeItem(TOKEN_KEY);
      } else if (this.storage instanceof Map) {
        this.storage.delete(SESSION_KEY);
        this.storage.delete(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  /**
   * Check if session exists and is valid
   */
  hasValidSession(): boolean {
    const session = this.getSession();
    return session !== null && session.expiresAt > Date.now();
  }
}


